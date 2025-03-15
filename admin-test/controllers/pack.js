const mongoose = require("mongoose");

const cloudinary = require("../utils/cloudinary");
const Pack = require("../models/pack");

const createPack = async (req, res) => {
  try {
    const {
      designation,
      price,
      oldPrice,
      smallDescription,
      question,
      description,
      status = true,
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

    // Upload main image to Cloudinary
    const mainImageFile = req.files.mainImage[0];
    const mainImageStr = mainImageFile.buffer.toString("base64");
    const mainImageDataUri = `data:${mainImageFile.mimetype};base64,${mainImageStr}`;

    const mainImageResult = await cloudinary.uploader.upload(mainImageDataUri, {
      folder: "packs/main",
      resource_type: "auto",
    });

    // Upload additional images to Cloudinary (if any)
    const images = [];
    if (req.files.images && req.files.images.length > 0) {
      for (const imageFile of req.files.images) {
        const imageStr = imageFile.buffer.toString("base64");
        const imageDataUri = `data:${imageFile.mimetype};base64,${imageStr}`;

        const imageResult = await cloudinary.uploader.upload(imageDataUri, {
          folder: "packs/additional",
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
      // Create the pack
      const newPack = await Pack.create(
        [
          {
            designation,
            smallDescription,
            description,
            question,
            price,
            oldPrice: parseFloat(oldPrice) || 0,
            products: JSON.parse(req?.body?.products) || [],
            features: JSON.parse(req?.body?.features) || [],
            status,
            mainImage: {
              url: mainImageResult.secure_url,
              img_id: mainImageResult.public_id,
            },
            images,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      return res.status(201).json({
        message: "Pack created successfully",
        data: newPack[0],
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error creating pack",
      error: error.message,
    });
  }
};

const updatePack = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: _id } = req.params;
    const rawData = {
      designation: req.body.designation,
      price: Number(req.body.price),
      oldPrice: Number(req.body.oldPrice || 0),
      smallDescription: req.body.smallDescription,
      question: req.body.question,
      description: req.body.description,
      status: req.body.status === "true",
      products: JSON.parse(req.body.products || "[]"),
      features: JSON.parse(req.body.features || "[]"),
      deletedImages: JSON.parse(req.body.deletedImages || "[]"),
    };

    // Validate required fields
    if (!rawData.designation || !rawData.price) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Designation and price are required fields",
      });
    }

    // Get existing pack with relationships
    const existingPack = await Pack.findById(_id).session(session);
    if (!existingPack) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Pack not found" });
    }

    // Handle image updates
    const [mainImage, images] = await Promise.all([
      handleMainImageUpdate(existingPack, req.files?.mainImage, session),
      handleGalleryImagesUpdate(
        existingPack,
        req.files?.images,
        rawData.deletedImages,
        session
      ),
    ]);

    // Build update payload
    const updatePayload = {
      designation: rawData.designation,
      price: rawData.price,
      oldPrice: rawData.oldPrice,
      smallDescription: rawData.smallDescription,
      question: rawData.question,
      description: rawData.description,
      status: rawData.status,
      products: rawData.products,
      features: rawData.features,
      mainImage: mainImage || existingPack.mainImage,
      images: images || existingPack.images,
    };

    // Update pack
    const updatedPack = await Pack.findByIdAndUpdate(_id, updatePayload, {
      new: true,
      session,
    }).populate("products");

    await session.commitTransaction();

    return res.status(200).json({
      message: "Pack updated successfully",
      data: updatedPack,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Error updating pack",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Helper functions
const handleMainImageUpdate = async (existingPack, newImageFile, session) => {
  if (!newImageFile) return null;

  // Delete old main image
  if (existingPack.mainImage?.img_id) {
    await cloudinary.uploader.destroy(existingPack.mainImage.img_id);
  }

  // Upload new main image
  const imageFile = newImageFile[0];
  const imageStr = imageFile.buffer.toString("base64");
  const dataUri = `data:${imageFile.mimetype};base64,${imageStr}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "packs/main",
    resource_type: "auto",
  });

  return {
    url: result.secure_url,
    img_id: result.public_id,
  };
};

const handleGalleryImagesUpdate = async (
  existingPack,
  newImages,
  deletedImageUrls,
  session
) => {
  // Delete removed images
  const imagesToDelete = existingPack.images.filter((img) =>
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
      folder: "packs/additional",
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      img_id: result.public_id,
    };
  });

  const uploadedImages = await Promise.all(newImageUploads);

  // Combine remaining and new images
  const remainingImages = existingPack.images.filter(
    (img) => !deletedImageUrls.includes(img.url)
  );

  return [...remainingImages, ...uploadedImages];
};

const deletePack = async (req, res) => {
  try {
    const { id: _id } = req.params;

    // Find pack
    const pack = await Pack.findById(_id);
    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }

    // Delete the pack
    await Pack.findByIdAndDelete(_id);

    return res.status(200).json({
      message: "Pack deleted successfully",
      data: pack,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting pack",
      error: error.message,
    });
  }
};

const getPackList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: true }; // Only active packs

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice)
        filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice)
        filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Stock filter (if needed)
    if (req.query.inStock === "true") {
      filter.inStock = true;
    }

    // Sort options
    const sortOptions = {};
    if (req.query.sort) {
      const sortField = req.query.sort;
      if (sortField.startsWith("-")) {
        sortOptions[sortField.substring(1)] = -1;
      } else {
        sortOptions[sortField] = 1;
      }
    } else {
      // Default sort
      sortOptions.createdAt = -1;
    }

    // Execute query with pagination
    const [packs, total] = await Promise.all([
      Pack.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select(
          "designation slug price oldPrice mainImage features status inStock rate reviews"
        ),
      Pack.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        packs,
        pagination: {
          total,
          currentPage: page,
          totalPages,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching packs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des packs",
      error: error.message,
    });
  }
};

const getPackById = async (req, res) => {
  try {
    const { id } = req.params;

    const pack = await Pack.findById(id);

    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }

    return res.status(200).json({
      message: "Pack retrieved successfully",
      data: pack,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving pack",
      error: error.message,
    });
  }
};

const deletePacksInBulk = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const packIds = req.body;

    // Validate input
    if (!Array.isArray(packIds) || packIds.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Please provide a non-empty array of pack IDs",
      });
    }

    // Validate MongoDB IDs
    const invalidIds = packIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid pack ID format",
        invalidIds,
      });
    }

    // Find packs with lock
    const packs = await Pack.find({ _id: { $in: packIds } }).session(session);
    if (packs.length !== packIds.length) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Some packs not found",
      });
    }

    // Delete database records first
    const deleteResult = await Pack.deleteMany(
      { _id: { $in: packIds } },
      { session }
    );

    // Commit transaction before external operations
    await session.commitTransaction();

    // Process Cloudinary deletions after successful commit
    const cloudinaryPromises = packs.flatMap((pack) => [
      ...(pack.mainImage?.img_id
        ? [cloudinary.uploader.destroy(pack.mainImage.img_id)]
        : []),
      ...(pack.images?.flatMap((image) =>
        image.img_id ? [cloudinary.uploader.destroy(image.img_id)] : []
      ) || []),
    ]);

    // Handle Cloudinary results with error tracking
    const cloudinaryResults = await Promise.allSettled(cloudinaryPromises);
    const failedDeletions = cloudinaryResults
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason.message);

    return res.status(200).json({
      message: "Bulk delete operation completed",
      data: {
        deletedPacks: deleteResult.deletedCount,
        totalImages: cloudinaryPromises.length,
        failedImageDeletions: failedDeletions.length,
        warnings: failedDeletions,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Bulk delete error:", error);
    return res.status(500).json({
      message: "Bulk delete operation failed",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// get all packs
const getAllPacks = async (req, res) => {
  try {
    const packs = await Pack.find().sort("-createdAt");
    return res.status(200).json({
      message: "Packs retrieved successfully",
      data: packs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving packs",
      error: error.message,
    });
  }
};

const getPackBySlug = async (req, res) => {
  try {
    const product = await Pack.findOne({ slug: req.params.slug }).select(
      "-_id"
    );

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

module.exports = {
  createPack,
  updatePack,
  deletePack,
  getPackList,
  getPackById,
  deletePacksInBulk,
  getAllPacks,
  getPackBySlug,
};
