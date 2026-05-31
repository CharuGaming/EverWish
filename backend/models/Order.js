const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// ─── Helper: Generate short EverWish order ID (EW-XXXX) ───────────
function generateOrderId() {
  return 'EW-' + uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
}

// ─── Order Schema ─────────────────────────────────────────────────
const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type:    String,
      unique:  true,
      default: generateOrderId,
    },

    // ── Customer Info ────────────────────────────────────────────
    customerName:  { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },

    // ── Template Info ────────────────────────────────────────────
    templateId:   { type: String, required: true, trim: true },
    templateName: { type: String, default: '', trim: true },
    category: {
      type: String,
      enum: ['valentine', 'birthday'],
      required: true,
    },

    // ── Dynamic form inputs (text fields, ages, messages, etc.) ──
    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ── Uploaded media ───────────────────────────────────────────
    images:   { type: [String], default: [] },  // Cloudinary URLs
    audioUrl: { type: String,   default: '' },

    // ── Order lifecycle ──────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },

    notes: { type: String, default: '' },
  },
  {
    timestamps: true, // createdAt, updatedAt auto-managed by Mongoose
  }
);

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
