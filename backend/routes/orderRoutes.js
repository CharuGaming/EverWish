const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');

// ─────────────────────────────────────────────────────────────────
//  POST /api/orders
//  Create a new customer order from the Order Form.
// ─────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      templateId,
      templateName,
      category,
      formData,
      images,
      audioUrl,
    } = req.body;

    if (!customerName || !customerPhone || !templateId || !category) {
      return res.status(400).json({
        success: false,
        message: 'customerName, customerPhone, templateId and category are required.',
      });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      templateId,
      templateName: templateName || templateId,
      category,
      formData:  formData  || {},
      images:    images    || [],
      audioUrl:  audioUrl  || '',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        orderId:      order.orderId,
        customerName: order.customerName,
        templateId:   order.templateId,
        templateName: order.templateName,
        createdAt:    order.createdAt,
      },
    });
  } catch (err) {
    console.error('[POST /api/orders]', err.message);
    res.status(500).json({ success: false, message: 'Server error placing order.' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  GET /api/orders
//  Fetch all orders for the Admin Dashboard (newest first).
// ─────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.error('[GET /api/orders]', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching orders.' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  PATCH /api/orders/:orderId/status
//  Update order status (pending → in_progress → completed).
// ─────────────────────────────────────────────────────────────────
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error('[PATCH /api/orders/:orderId/status]', err.message);
    res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

module.exports = router;
