const Information = require("../models/information");
const cloudinary = require("../utils/cloudinary");

const multer = require("multer");
const { memoryStorage } = require("multer");

// Configure multer for memory storage
const upload = multer({
  storage: memoryStorage(),
});

// Middleware for handling multiple file uploads
const uploadSlideImages = upload.array("images", 25); // Allow up to25 images at once

const getInformation = async (req, res) => {
  try {
    let information = await Information.findOne().select("-_id");

    if (!information) {
      // Create default information if not exist
      information = await Information.create({}).select("-_id");
    }

    return res.status(200).json({
      message: "Information fetched successfully",
      data: information,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGeneralData = async (req, res) => {
  try {
    const generalInfo = await Information.findOne().select("general -_id");
    res.status(200).json(generalInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateGeneralInformation = async (req, res) => {
  try {
    const information = await Information.findOne();

    if (!information) {
      return res
        .status(404)
        .json({ message: "Information document not found" });
    }

    // Handle logo upload if present
    let logoResult = null;
    if (req.file) {
      // Delete previous logo if exists
      if (information.general?.logo?.img_id) {
        await cloudinary.uploader.destroy(information.general.logo.img_id);
      }

      // Prepare new image for upload
      const fileStr = req.file.buffer.toString("base64");
      const fileType = req.file.mimetype;
      const dataUri = `data:${fileType};base64,${fileStr}`;

      // Upload to Cloudinary
      logoResult = await cloudinary.uploader.upload(dataUri, {
        folder: "general",
        resource_type: "auto",
        transformation: [{ width: 500, crop: "limit" }, { quality: "auto" }],
      });
    }

    // Prepare the update object matching the schema structure
    const updateObject = {
      "general.contact": {
        phone: req.body.contact.phone || information.general.contact.phone,
        fax: req.body.contact.fax || information.general.contact.fax,
        email: req.body.contact.email || information.general.contact.email,
        address:
          req.body.contact.address || information.general.contact.address,
      },
      "general.social": {
        facebookUrl:
          req.body.social.facebookUrl || information.general.social.facebookUrl,
        twitterUrl:
          req.body.social.twitterUrl || information.general.social.twitterUrl,
        linkedInUrl:
          req.body.social.linkedInUrl || information.general.social.linkedInUrl,
        instagramUrl:
          req.body.social.instagramUrl ||
          information.general.social.instagramUrl,
        pinterestUrl:
          req.body.social.pinterestUrl ||
          information.general.social.pinterestUrl,
        youtubeUrl:
          req.body.social.youtubeUrl || information.general.social.youtubeUrl,
        whatsAppUrl:
          req.body.social.whatsAppUrl || information.general.social.whatsAppUrl,
      },
      "general.playStoreUrl":
        req.body.playStoreUrl || information.general.playStoreUrl,
      "general.appStoreUrl":
        req.body.appStoreUrl || information.general.appStoreUrl,
    };

    // Add logo if new one was uploaded
    if (logoResult) {
      updateObject["general.logo"] = {
        url: logoResult.secure_url,
        img_id: logoResult.public_id,
      };
    }

    // Update the document
    const updatedInformation = await Information.findOneAndUpdate(
      {},
      { $set: updateObject },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "General information updated successfully",
      data: updatedInformation.general,
    });
  } catch (error) {
    console.error("Error updating general information:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating general information",
      error: error.message,
    });
  }
};

const getAdvancedData = async (req, res) => {
  try {
    const advancedInfo = await Information.findOne().select("advanced -_id");
    res.status(200).json(advancedInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAdvancedInformation = async (req, res) => {
  try {
    const information = await Information.findOne();
    if (!information) {
      return res
        .status(404)
        .json({ message: "Information document not found" });
    }
    const updateObject = {
      "advanced.matricule":
        req.body.matricule || information.advanced.matricule,
      "advanced.rib": req.body.rib || information.advanced.rib,
      "advanced.registerDeCommerce":
        req.body.registerDeCommerce || information.advanced.registerDeCommerce,
      "advanced.livraison":
        req.body.livraison || information.advanced.livraison,
      "advanced.timber": req.body.timber || information.advanced.timber,
      "advanced.tva": req.body.tva || information.advanced.tva,
    };
    const updatedInformation = await Information.findOneAndUpdate(
      {},
      { $set: updateObject },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Advanced information updated successfully",
      data: updatedInformation.advanced,
    });
  } catch (error) {
    console.error("Error updating advanced information:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating advanced information",
      error: error.message,
    });
  }
};

const updateMaterielImageSection = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get current information
    let information = await Information.findOne();
    if (!information) {
      information = new Information({});
    }

    // Create data URI from buffer
    const fileStr = req.file.buffer.toString("base64");
    const fileType = req.file.mimetype;
    const dataUri = `data:${fileType};base64,${fileStr}`;

    // Delete old image if exists
    if (
      information.homePage &&
      information.homePage.images &&
      information.homePage.images.materielImageSection &&
      information.homePage.images.materielImageSection.img_id
    ) {
      await cloudinary.uploader.destroy(
        information.homePage.images.materielImageSection.img_id
      );
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "materiel-section",
      resource_type: "auto",
      transformation: [
        { width: 1200, crop: "limit" }, // Resize if larger than 1200px
        { quality: "auto" }, // Automatic quality optimization
      ],
    });

    // Ensure the nested structure exists
    if (!information.homePage) {
      information.homePage = {};
    }
    if (!information.homePage.images) {
      information.homePage.images = {};
    }

    // Update the materielImageSection
    information.homePage.images.materielImageSection = {
      url: result.secure_url,
      img_id: result.public_id,
    };

    await information.save();

    return res.status(200).json({
      message: "Materiel image section updated successfully",
      data: information.homePage.images.materielImageSection,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message || "Error uploading image",
    });
  }
};

const deleteMaterielImageSection = async (req, res) => {
  try {
    // Get current information
    const information = await Information.findOne();

    if (!information) {
      return res.status(404).json({ message: "Information not found" });
    }

    // Check if materiel image exists
    if (
      !information.homePage ||
      !information.homePage.images ||
      !information.homePage.images.materielImageSection ||
      !information.homePage.images.materielImageSection.img_id
    ) {
      return res.status(404).json({ message: "Materiel image not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(
      information.homePage.images.materielImageSection.img_id
    );

    // Remove image reference
    information.homePage.images.materielImageSection = undefined;
    await information.save();

    return res.status(200).json({
      message: "Materiel image section deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message || "Error deleting image",
    });
  }
};

const getMaterielImageSection = async (req, res) => {
  try {
    const information = await Information.findOne();

    if (
      !information ||
      !information.homePage ||
      !information.homePage.images ||
      !information.homePage.images.materielImageSection
    ) {
      return res.status(404).json({ message: "Materiel image not found" });
    }

    return res.status(200).json({
      message: "Materiel image fetched successfully",
      data: information.homePage.images.materielImageSection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSlides = async (req, res) => {
  try {
    const information = await Information.findOne();

    if (!information || !information.homePage || !information.homePage.images) {
      return res.status(200).json({
        message: "No slides found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Slides fetched successfully",
      data: information.homePage.images.slides || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching slides",
      error: error.message,
    });
  }
};

const addSlideImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Fetch the Information document
    let information = await Information.findOne();
    if (!information) {
      information = new Information({});
    }

    // Initialize homePage.images.slides if not exists
    if (!information.homePage) information.homePage = {};
    if (!information.homePage.images) information.homePage.images = {};
    if (!information.homePage.images.slides)
      information.homePage.images.slides = [];

    // Process each uploaded file
    const uploadPromises = req.files.map(async (file) => {
      // Create data URI from buffer
      const fileStr = file.buffer.toString("base64");
      const fileType = file.mimetype;
      const dataUri = `data:${fileType};base64,${fileStr}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "slides",
        resource_type: "auto",
        transformation: [
          { width: 1920, crop: "limit" }, // Resize if larger than 1920px width
          { quality: "auto" }, // Automatic quality optimization
        ],
      });

      // Return the image data to be added to slides
      return {
        url: result.secure_url,
        img_id: result.public_id,
      };
    });

    // Wait for all uploads to complete
    const newSlides = await Promise.all(uploadPromises);

    // Add new slides to the array
    information.homePage.images.slides.push(...newSlides);

    // Save the updated document
    await information.save();

    return res.status(200).json({
      message: "Slide images uploaded successfully",
      data: information.homePage.images.slides,
    });
  } catch (error) {
    console.error("Error uploading slides:", error);
    return res.status(500).json({
      message: "Error uploading slide images",
      error: error.message,
    });
  }
};

const deleteSlideImage = async (req, res) => {
  try {
    const { imgId } = req.params;

    // Fetch the Information document
    const information = await Information.findOne();

    if (
      !information ||
      !information.homePage ||
      !information.homePage.images ||
      !information.homePage.images.slides
    ) {
      return res.status(404).json({ message: "Slides not found" });
    }

    // Find the index of the slide to delete
    const slideIndex = information.homePage.images.slides.findIndex(
      (slide) => slide.img_id === "slides/" + imgId
    );

    if (slideIndex === -1) {
      return res.status(404).json({ message: "Slide image not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`slides/${imgId}`);

    // Remove from slides array
    information.homePage.images.slides.splice(slideIndex, 1);

    // Save the updated document
    await information.save();

    return res.status(200).json({
      message: "Slide image deleted successfully",
      data: information.homePage.images.slides,
    });
  } catch (error) {
    console.error("Error deleting slide:", error);
    return res.status(500).json({
      message: "Error deleting slide image",
      error: error.message,
    });
  }
};

const updateSlidesOrder = async (req, res) => {
  try {
    const { slides } = req.body;

    if (!Array.isArray(slides)) {
      return res.status(400).json({ message: "Invalid slides data" });
    }

    // Fetch the Information document
    const information = await Information.findOne();

    if (!information) {
      return res
        .status(404)
        .json({ message: "Information document not found" });
    }

    // Initialize homePage.images.slides if not exists
    if (!information.homePage) information.homePage = {};
    if (!information.homePage.images) information.homePage.images = {};

    // Verify all slides exist before updating
    const existingIds = new Set(
      (information.homePage.images.slides || []).map((slide) => slide.img_id)
    );

    const allSlidesExist = slides.every((slide) =>
      existingIds.has(slide.img_id)
    );

    if (!allSlidesExist) {
      return res
        .status(400)
        .json({ message: "One or more slide IDs are invalid" });
    }

    // Update slides array with new order
    information.homePage.images.slides = slides;

    // Save the updated document
    await information.save();

    return res.status(200).json({
      message: "Slides order updated successfully",
      data: information.homePage.images.slides,
    });
  } catch (error) {
    console.error("Error updating slides order:", error);
    return res.status(500).json({
      message: "Error updating slides order",
      error: error.message,
    });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const information = await Information.findOne();
    if (!information || !information.homePage || !information.homePage.images) {
      return res.status(200).json({
        message: "No brands found",
        data: [],
      });
    }
    return res.status(200).json({
      message: "Brands fetched successfully",
      data: information.homePage.images.brands || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching brands",
      error: error.message,
    });
  }
};

const addBrandImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let information = await Information.findOne();
    if (!information) {
      information = new Information({});
    }

    // Initialize nested structure if it doesn’t exist
    if (!information.homePage) information.homePage = {};
    if (!information.homePage.images) information.homePage.images = {};
    if (!information.homePage.images.brands)
      information.homePage.images.brands = [];

    // Process and upload each file to Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const fileStr = file.buffer.toString("base64");
      const fileType = file.mimetype;
      const dataUri = `data:${fileType};base64,${fileStr}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "brands",
        resource_type: "auto",
        transformation: [
          { width: 500, crop: "limit" }, // Suitable size for logos
          { quality: "auto" },
        ],
      });
      return {
        url: result.secure_url,
        img_id: result.public_id,
      };
    });

    const newBrands = await Promise.all(uploadPromises);
    information.homePage.images.brands.push(...newBrands);
    await information.save();

    return res.status(200).json({
      message: "Brand images uploaded successfully",
      data: information.homePage.images.brands,
    });
  } catch (error) {
    console.error("Error uploading brands:", error);
    return res.status(500).json({
      message: "Error uploading brand images",
      error: error.message,
    });
  }
};

const deleteBrandImage = async (req, res) => {
  try {
    const { imgId } = req.params;
    const information = await Information.findOne();

    if (
      !information ||
      !information.homePage ||
      !information.homePage.images ||
      !information.homePage.images.brands
    ) {
      return res.status(404).json({ message: "Brands not found" });
    }

    const brandIndex = information.homePage.images.brands.findIndex(
      (brand) => brand.img_id === `brands/${imgId}`
    );
    if (brandIndex === -1) {
      return res.status(404).json({ message: "Brand image not found" });
    }

    await cloudinary.uploader.destroy(`brands/${imgId}`);
    information.homePage.images.brands.splice(brandIndex, 1);
    await information.save();

    return res.status(200).json({
      message: "Brand image deleted successfully",
      data: information.homePage.images.brands,
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return res.status(500).json({
      message: "Error deleting brand image",
      error: error.message,
    });
  }
};

const updateBrandsOrder = async (req, res) => {
  try {
    const { brands } = req.body;
    if (!Array.isArray(brands)) {
      return res.status(400).json({ message: "Invalid brands data" });
    }

    const information = await Information.findOne();
    if (!information) {
      return res
        .status(404)
        .json({ message: "Information document not found" });
    }

    if (!information.homePage) information.homePage = {};
    if (!information.homePage.images) information.homePage.images = {};

    // Verify all brand IDs exist
    const existingIds = new Set(
      (information.homePage.images.brands || []).map((brand) => brand.img_id)
    );
    const allBrandsExist = brands.every((brand) =>
      existingIds.has(brand.img_id)
    );
    if (!allBrandsExist) {
      return res
        .status(400)
        .json({ message: "One or more brand IDs are invalid" });
    }

    information.homePage.images.brands = brands;
    await information.save();

    return res.status(200).json({
      message: "Brands order updated successfully",
      data: information.homePage.images.brands,
    });
  } catch (error) {
    console.error("Error updating brands order:", error);
    return res.status(500).json({
      message: "Error updating brands order",
      error: error.message,
    });
  }
};

module.exports = {
  getGeneralData,
  updateGeneralInformation,
  getAdvancedData,
  updateAdvancedInformation,
  getInformation,
  updateMaterielImageSection,
  deleteMaterielImageSection,
  getMaterielImageSection,
  getAllSlides,
  addSlideImages,
  deleteSlideImage,
  updateSlidesOrder,
  uploadSlideImages,
  getAllBrands,
  addBrandImages,
  deleteBrandImage,
  updateBrandsOrder,
};
