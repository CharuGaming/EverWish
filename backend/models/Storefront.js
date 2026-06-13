const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  price: String, // String to handle "Rs. 2,500" or raw numbers
  tag: String,
  description: String,
  badge: String,
  // For backward compatibility with existing storefront
  emoji: String,
  gradient: String,
  isActive: { type: Boolean, default: true },
  imageUrl: String,
  longScreenshotUrl: { type: String, default: '' }  // Full-page scrollable preview screenshot
});

const testimonialSchema = new mongoose.Schema({
  name: String,
  templateName: String,
  rating: Number,
  text: String,
  avatar: String,
  screenshotUrl: String // Added to allow customers to upload proof screenshots
});

const storefrontSchema = new mongoose.Schema({
  isGlobal: { type: Boolean, default: true, unique: true },
  templates: [templateSchema],
  testimonials: [testimonialSchema]
}, { timestamps: true });

module.exports = mongoose.models.Storefront || mongoose.model('Storefront', storefrontSchema);
