const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");
const cloudinary = require("../utils/cloudinary");

const createProduct = async (req, res) => {
  try {
    const {
      designation,
      inStock,
      smallDescription,
      brand,
      status,
      description,
      question,
      price,
      oldPrice,
      venteflashDate,
      categoryId,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!designation) missingFields.push("designation");
    if (!price) missingFields.push("price");
    if (!req.files?.mainImage) missingFields.push("mainImage");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Required fields are missing ${missingFields.join(", ")}`,
      });
    }

    // Validate category exists if categoryId is provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const subCategoryIds = JSON.parse(req.body.subCategoryIds || "[]");

    // Validate that subCategoryIds is an array of strings
    if (!Array.isArray(subCategoryIds)) {
      return res
        .status(400)
        .json({ message: "subCategoryIds must be an array" });
    }

    // Validate that all IDs are valid MongoDB ObjectIds
    const isValid = subCategoryIds.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!isValid) {
      return res.status(400).json({ message: "Invalid subCategoryIds" });
    }

    // Validate all subcategories if provided
    if (subCategoryIds && subCategoryIds.length > 0) {
      const subCategories = await SubCategory.find({
        _id: { $in: subCategoryIds },
      });

      // Check if all subcategories were found
      if (subCategories.length !== subCategoryIds.length) {
        return res.status(404).json({
          message: "One or more sub-categories not found",
        });
      }

      // Validate that all subcategories belong to the specified category
      if (categoryId) {
        const invalidSubCategories = subCategories.filter(
          (subCat) => subCat.category.toString() !== categoryId
        );

        if (invalidSubCategories.length > 0) {
          return res.status(400).json({
            message:
              "Some sub-categories do not belong to the specified category",
            invalidSubCategories: invalidSubCategories.map((sc) => sc._id),
          });
        }
      }
    }

    // Upload main image to Cloudinary
    const mainImageFile = req.files.mainImage[0];
    const mainImageStr = mainImageFile.buffer.toString("base64");
    const mainImageDataUri = `data:${mainImageFile.mimetype};base64,${mainImageStr}`;

    const mainImageResult = await cloudinary.uploader.upload(mainImageDataUri, {
      folder: "products/main",
      resource_type: "auto",
    });

    // Upload additional images to Cloudinary (if any)
    const images = [];
    if (req.files.images && req.files.images.length > 0) {
      for (const imageFile of req.files.images) {
        const imageStr = imageFile.buffer.toString("base64");
        const imageDataUri = `data:${imageFile.mimetype};base64,${imageStr}`;

        const imageResult = await cloudinary.uploader.upload(imageDataUri, {
          folder: "products/additional",
          resource_type: "auto",
        });

        images.push({
          url: imageResult.secure_url,
          img_id: imageResult.public_id,
        });
      }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the product
      const newProduct = await Product.create(
        [
          {
            designation,
            description,
            smallDescription,
            price,
            question,
            oldPrice: parseFloat(oldPrice) || 0,
            inStock,
            brand,
            venteflashDate,
            status,
            features: JSON.parse(req?.body.features) || [],
            mainImage: {
              url: mainImageResult.secure_url,
              img_id: mainImageResult.public_id,
            },
            images,
            nutritionalValues: JSON.parse(req?.body.nutritionalValues) || [],
            variant: JSON.parse(req?.body.variant) || [],
            category: categoryId || null,
            subCategory: subCategoryIds || [],
          },
        ],
        { session }
      );

      // Update category if provided
      if (categoryId) {
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $push: { products: newProduct[0]._id },
          },
          { session }
        );
      }

      // Update all subcategories if provided
      if (subCategoryIds && subCategoryIds.length > 0) {
        await SubCategory.updateMany(
          { _id: { $in: subCategoryIds } },
          {
            $push: { products: newProduct[0]._id },
          },
          { session }
        );
      }

      await session.commitTransaction();

      return res.status(201).json({
        message: "Product created successfully",
        data: newProduct[0],
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id: _id } = req.params;

    // Find product and populate references
    const product = await Product.findById(_id)
      .populate("category")
      .populate("subCategory");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove product reference from category if exists
      if (product.category) {
        await Category.findByIdAndUpdate(
          product.category._id,
          {
            $pull: { products: product._id },
          },
          { session }
        );
      }

      // Remove product reference from all subcategories if exists
      if (product.subCategory && product.subCategory.length > 0) {
        await SubCategory.updateMany(
          { _id: { $in: product.subCategory } },
          {
            $pull: { products: product._id },
          },
          { session }
        );
      }

      // Delete product images from storage if needed
      if (product.mainImage) {
        await cloudinary.uploader.destroy(product.mainImage.img_id);
      }

      if (product.images && product.images.length > 0) {
        // Delete additional product images
        for (const image of product.images) {
          await cloudinary.uploader.destroy(image.img_id);
        }
      }

      // Delete the product
      await Product.findByIdAndDelete(_id, { session });

      await session.commitTransaction();

      return res.status(200).json({
        message: "Product deleted successfully",
        data: product,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: productId } = req.params;
    const rawData = {
      designation: req.body?.designation,
      question: req.body?.question,
      description: req.body?.description,
      smallDescription: req.body?.smallDescription,
      venteflashDate: req.body?.venteflashDate || "",
      price: Number(req.body?.price),
      oldPrice: Number(req.body?.oldPrice || 0),
      inStock: req.body?.inStock === "true",
      status: req.body?.status === "true",
      features: JSON.parse(req.body.features || "[]"),
      categoryId: req.body?.categoryId,
      variant: JSON.parse(req.body?.variant || "[]"),
      subCategoryIds: JSON.parse(req.body.subCategoryIds || "[]"),
      brand: req.body?.brand,
      nutritionalValues: JSON.parse(req.body.nutritionalValues || "[]"),
      deletedImages: JSON.parse(req.body.deletedImages || "[]"),
    };

    // Validate required fields
    if (!rawData.designation || !rawData.price) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Designation and price are required fields",
      });
    }

    // Get existing product with relationships
    const existingProduct = await Product.findById(productId)
      .populate("category subCategory")
      .session(session);

    if (!existingProduct) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Product not found" });
    }

    // CATEGORY VALIDATION
    let newCategory = null;
    if (rawData.categoryId) {
      newCategory = await Category.findById(rawData.categoryId).session(
        session
      );
      if (!newCategory) {
        await session.abortTransaction();
        return res.status(404).json({ message: "New category not found" });
      }
    }

    // SUBCATEGORY VALIDATION
    if (rawData.subCategoryIds.length > 0) {
      try {
        const validObjectIds = rawData.subCategoryIds.every((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );

        if (!validObjectIds) {
          await session.abortTransaction();
          return res.status(400).json({
            message: "Invalid subcategory IDs format",
          });
        }

        const subCategories = await SubCategory.find({
          _id: { $in: rawData.subCategoryIds },
          category: rawData.categoryId || existingProduct.category._id,
        }).session(session);

        if (subCategories.length !== rawData.subCategoryIds.length) {
          await session.abortTransaction();
          return res.status(400).json({
            message:
              "Some subcategories don't exist or don't belong to the selected category",
          });
        }
      } catch (error) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Error validating subcategories",
          error: error.message,
        });
      }
    }
    // IMAGE HANDLING
    const [mainImage, images] = await Promise.all([
      handleMainImageUpdate(existingProduct, req.files?.mainImage, session),
      handleGalleryImagesUpdate(
        existingProduct,
        req.files?.images,
        rawData.deletedImages,
        session
      ),
    ]);

    // Prepare update payload
    const updatePayload = {
      designation: rawData.designation,
      description: rawData.description,
      smallDescription: rawData.smallDescription,
      venteflashDate: rawData.venteflashDate,
      question: rawData.question,
      price: rawData.price,
      oldPrice: rawData.oldPrice,
      inStock: rawData.inStock,
      status: rawData.status,
      features: rawData.features,
      variant: rawData.variant,
      nutritionalValues: rawData.nutritionalValues,
      brand: rawData.brand,
      mainImage: mainImage || existingProduct.mainImage,
      images: images || existingProduct.images,
      category: rawData.categoryId || existingProduct.category._id,
      subCategory:
        rawData.subCategoryIds.length > 0
          ? rawData.subCategoryIds
          : existingProduct.subCategory.map((sub) => sub._id),
    };

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatePayload,
      { new: true, session }
    ).populate("category subCategory");

    // HANDLE CATEGORY RELATIONSHIPS
    await handleCategoryRelationships(
      existingProduct,
      updatedProduct,
      newCategory,
      rawData.subCategoryIds,
      session
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// HELPER FUNCTIONS

const handleMainImageUpdate = async (
  existingProduct,
  newImageFile,
  session
) => {
  if (!newImageFile) return null;

  // Delete old main image
  if (existingProduct.mainImage?.img_id) {
    await cloudinary.uploader.destroy(existingProduct.mainImage.img_id);
  }

  // Upload new main image
  const imageFile = newImageFile[0];
  const imageStr = imageFile.buffer.toString("base64");
  const dataUri = `data:${imageFile.mimetype};base64,${imageStr}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "products/main",
    resource_type: "auto",
  });

  return {
    url: result.secure_url,
    img_id: result.public_id,
  };
};

const handleGalleryImagesUpdate = async (
  existingProduct,
  newImages,
  deletedImageUrls,
  session
) => {
  // Delete removed images
  const imagesToDelete = existingProduct.images.filter((img) =>
    deletedImageUrls.includes(img.url)
  );

  await Promise.all(
    imagesToDelete.map(async (img) => {
      await cloudinary.uploader.destroy(img.img_id);
    })
  );

  // Upload new images
  const newImageUploads = (newImages || []).map(async (imageFile) => {
    const imageStr = imageFile.buffer.toString("base64");
    const dataUri = `data:${imageFile.mimetype};base64,${imageStr}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "products/additional",
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      img_id: result.public_id,
    };
  });

  const uploadedImages = await Promise.all(newImageUploads);

  // Combine remaining and new images
  const remainingImages = existingProduct.images.filter(
    (img) => !deletedImageUrls.includes(img.url)
  );

  return [...remainingImages, ...uploadedImages];
};

const handleCategoryRelationships = async (
  existingProduct,
  updatedProduct,
  newCategory,
  newSubCategoryIds,
  session
) => {
  // Handle category changes
  if (
    existingProduct.category?.toString() !== updatedProduct.category?.toString()
  ) {
    // Remove from old category
    if (existingProduct.category) {
      await Category.findByIdAndUpdate(
        existingProduct.category,
        { $pull: { products: existingProduct._id } },
        { session }
      );
    }

    // Add to new category
    if (newCategory) {
      await Category.findByIdAndUpdate(
        newCategory._id,
        { $addToSet: { products: updatedProduct._id } },
        { session }
      );
    }
  }

  // Handle subcategory changes
  const existingSubIds = existingProduct.subCategory.map((id) =>
    id instanceof mongoose.Types.ObjectId ? id.toString() : id
  );
  const newSubIds = newSubCategoryIds.map((id) => id.toString());

  const subToRemove = existingSubIds.filter((id) => !newSubIds.includes(id));
  const subToAdd = newSubIds.filter((id) => !existingSubIds.includes(id));

  // Remove from old subcategories
  if (subToRemove.length > 0) {
    await SubCategory.updateMany(
      { _id: { $in: subToRemove } },
      { $pull: { products: updatedProduct._id } },
      { session }
    );
  }

  // Add to new subcategories
  if (subToAdd.length > 0) {
    await SubCategory.updateMany(
      { _id: { $in: subToAdd } },
      { $addToSet: { products: updatedProduct._id } },
      { session }
    );
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      sort = "-createdAt",
      category,
      subCategory,
      search,
      minPrice,
      maxPrice,
      status = true,
    } = req.query;

    let query = { status };

    // Handle category filtering using designation
    if (category) {
      const categoryDesignations = Array.isArray(category)
        ? category
        : [category];
      const categories = await Category.find({
        designation: { $in: categoryDesignations },
      }).select("_id");

      if (categories.length > 0) {
        const categoryIds = categories.map((cat) => cat._id);
        query.category = { $in: categoryIds };
      } else {
        // If no categories match, return no products
        query.category = { $in: [] };
      }
    }

    // Handle subcategory filtering using designation
    if (subCategory) {
      const subCategoryDesignations = Array.isArray(subCategory)
        ? subCategory
        : [subCategory];
      const subCategories = await SubCategory.find({
        designation: { $in: subCategoryDesignations },
      }).select("_id");

      if (subCategories.length > 0) {
        const subCategoryIds = subCategories.map((subCat) => subCat._id);
        query.subCategory = { $in: subCategoryIds };
      } else {
        // If no subcategories match, return no products
        query.subCategory = { $in: [] };
      }
    }

    // Search filter (using product designation or description)
    if (search) {
      query.$or = [
        { designation: { $regex: search, $options: "i" } },
        { smallDescription: { $regex: search, $options: "i" } },
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Get total matching products
    const totalProducts = await Product.countDocuments(query);

    // Fetch products with populated category and subcategory designations
    const products = await Product.find(query)
      .populate("category", "designation") // Only return designation, not _id
      .populate("subCategory", "designation") // Only return designation, not _id
      .sort(sort);

    return res.status(200).json({
      message: "Products retrieved successfully",
      data: {
        products,
        pagination: {
          total: totalProducts,
        },
      },
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({
      message: "Error retrieving products",
      error: error.message,
    });
  }
};

const getAllProductsNormal = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "designation") // Just get category name
      .populate("subCategory", "designation") // Just get subcategory names
      .sort("-createdAt");

    return res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving products",
      error: error.message,
    });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category")
      .populate("subCategory");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
};

const deleteManyProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of product IDs to delete",
      });
    }

    // Find all products with their category and subcategory references
    const products = await Product.find({ _id: { $in: productIds } })
      .populate("category")
      .populate("subCategory");

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found with the provided IDs",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Collect unique category and subcategory IDs
      const categoryIds = new Set();
      const subCategoryIds = new Set();

      // Delete images from Cloudinary
      for (const product of products) {
        // Delete main image
        if (product.mainImage && product.mainImage.img_id) {
          await cloudinary.uploader.destroy(product.mainImage.img_id);
        }

        // Delete additional images
        if (product.images && product.images.length > 0) {
          for (const image of product.images) {
            if (image.img_id) {
              await cloudinary.uploader.destroy(image.img_id);
            }
          }
        }

        // Collect category and subcategory IDs for reference cleanup
        if (product.category) {
          categoryIds.add(product.category._id.toString());
        }
        if (product.subCategory && product.subCategory.length > 0) {
          product.subCategory.forEach((subCat) => {
            subCategoryIds.add(subCat._id.toString());
          });
        }
      }

      // Update categories to remove product references
      if (categoryIds.size > 0) {
        await Category.updateMany(
          { _id: { $in: Array.from(categoryIds) } },
          {
            $pull: { products: { $in: productIds } },
          },
          { session }
        );
      }

      // Update subcategories to remove product references
      if (subCategoryIds.size > 0) {
        await SubCategory.updateMany(
          { _id: { $in: Array.from(subCategoryIds) } },
          {
            $pull: { products: { $in: productIds } },
          },
          { session }
        );
      }

      // Delete the products
      const deleteResult = await Product.deleteMany(
        { _id: { $in: productIds } },
        { session }
      );

      await session.commitTransaction();

      return res.status(200).json({
        message: "Products deleted successfully",
        data: {
          deletedCount: deleteResult.deletedCount,
          productsFound: products.length,
          categoriesUpdated: categoryIds.size,
          subCategoriesUpdated: subCategoryIds.size,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting products",
      error: error.message,
    });
  }
};

// get product by slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-_id")
      .populate("category")
      .populate("subCategory");

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res
      .status(200)
      .json({ message: "Products retrieved successfully", data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving product by slug", error });
  }
};

const getProductsWithMilleurVente = async (req, res) => {
  try {
    // Find products where features array contains "milleur vente"
    const products = await Product.find({
      features: { $elemMatch: { $regex: /meilleur vente/i } },
      status: true,
    })
      .select({
        // Include only these fields
        designation: 1,
        slug: 1,
        smallDescription: 1,
        price: 1,
        oldPrice: 1,
        "mainImage.url": 1, // Only include URL from mainImage
        "images.url": 1, // Only include URL from images
        inStock: 1,
        features: 1,
        variant: 1,
        nutritionalValues: 1,
        category: 1,
        subCategory: 1,
        brand: 1,
        rate: 1,
        reviews: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,

        // Explicitly exclude sensitive fields
        _id: 0,
      })
      .populate({
        path: "category",
        select: "designation -_id", // Only include designation, exclude _id
      })
      .populate({
        path: "subCategory",
        select: "designation -_id", // Only include designation, exclude _id
      });

    // Check if any products were found
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products with 'meilleur vente' feature found",
      });
    }

    // Return products
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching meilleur vente products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const getProductsWithNewVente = async (req, res) => {
  try {
    // Find products where features array contains "milleur vente"
    const products = await Product.find({
      features: { $elemMatch: { $regex: /nouveau/i } },
      status: true,
    })
      .select({
        // Include only these fields
        designation: 1,
        slug: 1,
        smallDescription: 1,
        price: 1,
        oldPrice: 1,
        "mainImage.url": 1, // Only include URL from mainImage
        "images.url": 1, // Only include URL from images
        inStock: 1,
        features: 1,
        variant: 1,
        nutritionalValues: 1,
        category: 1,
        subCategory: 1,
        brand: 1,
        rate: 1,
        reviews: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,

        // Explicitly exclude sensitive fields
        _id: 0,
      })
      .populate({
        path: "category",
        select: "designation -_id", // Only include designation, exclude _id
      })
      .populate({
        path: "subCategory",
        select: "designation -_id", // Only include designation, exclude _id
      });

    // Check if any products were found
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products with 'nouveau vente' feature found",
      });
    }

    // Return products
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching nouveau vente products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getProductsWithVenteFlashVente = async (req, res) => {
  try {
    // Find products where features array contains "milleur vente"
    const products = await Product.find({
      features: { $elemMatch: { $regex: /vente-flash/i } },
      status: true,
    })
      .select({
        // Include only these fields
        designation: 1,
        slug: 1,
        smallDescription: 1,
        price: 1,
        oldPrice: 1,
        "mainImage.url": 1, // Only include URL from mainImage
        "images.url": 1, // Only include URL from images
        inStock: 1,
        features: 1,
        variant: 1,
        nutritionalValues: 1,
        category: 1,
        brand: 1,
        rate: 1,
        subCategory: 1,
        reviews: 1,
        createdAt: 1,
        updatedAt: 1,
        venteflashDate: 1,
        __v: 1,

        // Explicitly exclude sensitive fields
        _id: 0,
      })
      .populate({
        path: "category",
        select: "designation -_id", // Only include designation, exclude _id
      })
      .populate({
        path: "subCategory",
        select: "designation -_id", // Only include designation, exclude _id
      });

    // Check if any products were found
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products with 'vente flash' feature found",
      });
    }

    // Return products
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching vente flash products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getProductsWithMaterielDeMusculation = async (req, res) => {
  try {
    // Find products where features array contains "milleur vente"
    const products = await Product.find({
      features: { $elemMatch: { $regex: /materiel-de-musculation/i } },
      status: true,
    })
      .select({
        // Include only these fields
        designation: 1,
        slug: 1,
        smallDescription: 1,
        price: 1,
        oldPrice: 1,
        "mainImage.url": 1, // Only include URL from mainImage
        "images.url": 1, // Only include URL from images
        inStock: 1,
        features: 1,
        variant: 1,
        nutritionalValues: 1,
        category: 1,
        brand: 1,
        rate: 1,
        subCategory: 1,
        reviews: 1,
        createdAt: 1,
        updatedAt: 1,
        venteflashDate: 1,
        __v: 1,

        // Explicitly exclude sensitive fields
        _id: 0,
      })
      .populate({
        path: "category",
        select: "designation -_id", // Only include designation, exclude _id
      })
      .populate({
        path: "subCategory",
        select: "designation -_id", // Only include designation, exclude _id
      });

    // Check if any products were found
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products with 'vente flash' feature found",
      });
    }

    // Return products
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching vente flash products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getMaxPrice = async (req, res) => {
  try {
    const product = await Product.findOne().sort("-price").select("price");

    const maxPrice = product?.price || 0;
    res.status(200).json({ maxPrice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching max price", error: error.message });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProductById,
  getAllProductsNormal,
  deleteManyProducts,
  getProductBySlug,
  getProductsWithMilleurVente,
  getProductsWithNewVente,
  getProductsWithVenteFlashVente,
  getProductsWithMaterielDeMusculation,
  getMaxPrice,
};
