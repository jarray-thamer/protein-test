const mongoose = require("mongoose");
const { Schema } = mongoose;

const InformationSchema = new Schema({
  general: {
    logo: {
      url: { type: String },
      img_id: { type: String },
    },
    contact: {
      phone: { type: String },
      fax: { type: String },
      email: { type: String },
      address: { type: String },
    },
    social: {
      facebookUrl: { type: String },
      twitterUrl: { type: String },
      linkedInUrl: { type: String },
      instagramUrl: { type: String },
      pinterestUrl: { type: String },
      youtubeUrl: { type: String },
      whatsAppUrl: { type: String },
    },
    playStoreUrl: { type: String },
    appStoreUrl: { type: String },
    appGalleryUrl: { type: String },
  },
  homePage: {
    images: {
      slides: [{ url: { type: String }, img_id: { type: String } }],
      materielImageSection: { url: { type: String }, img_id: { type: String } },
      brands: [{ url: { type: String }, img_id: { type: String } }],
    },
  },
  reviews: [
    {
      reviewer_name: { type: String },
      review_content: { type: String },
      rating: { type: Number },
    },
  ],
  advanced: {
    matricule: { type: String },
    rib: { type: String },
    registerDeCommerce: { type: String },
    livraison: { type: Number },
    timber: { type: Number },
    tva: { type: Number },
  },
});

const Information =
  mongoose.models.Information ||
  mongoose.model("Information", InformationSchema);

module.exports = Information;
