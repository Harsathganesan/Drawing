// routes/orderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure uploads directory exists (Use /tmp for Vercel, as project dir is read-only)
const uploadDir = process.env.VERCEL 
    ? path.join('/tmp', 'uploads') 
    : path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ===== UPLOAD IMAGE =====
// POST /api/orders/upload
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        // Return the full URL for the image
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const imageUrl = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            data: {
                url: imageUrl,
                filename: req.file.filename
            }
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
});

// ===== CREATE ORDER =====
// POST /api/orders
router.post('/', async (req, res) => {
    try {
        console.log('📦 Received order from React frontend:');
        console.log('Order data:', JSON.stringify(req.body, null, 2));

        // Create new order from request body
        const orderData = {
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerPhone: req.body.customerPhone,
            drawingType: req.body.drawingType,
            size: req.body.size,
            price: req.body.price,
            description: req.body.description || '',
            specialInstructions: req.body.specialInstructions || '',
            paymentMethod: req.body.paymentMethod || 'online',
            referenceImage: req.body.referenceImage || ''
        };

        // Validate required fields
        const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'drawingType', 'size', 'price'];
        const missingFields = requiredFields.filter(field => !orderData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`,
                missingFields: missingFields
            });
        }

        // Validate price is a number
        if (isNaN(orderData.price) || orderData.price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a positive number'
            });
        }

        // Create and save order
        const order = new Order(orderData);
        const savedOrder = await order.save();

        console.log('✅ Order saved to MongoDB Atlas!');
        console.log('Order ID:', savedOrder._id);
        console.log('Order Number:', savedOrder.orderNumber);

        // Send success response
        res.status(201).json({
            success: true,
            message: '✅ Order placed successfully!',
            order: {
                id: savedOrder._id,
                orderNumber: savedOrder.orderNumber,
                customerName: savedOrder.customerName,
                drawingType: savedOrder.drawingType,
                price: savedOrder.price,
                orderDate: savedOrder.orderDate
                // Note: status field removed from response
            }
        });

    } catch (error) {
        console.error('❌ Error saving order:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate entry. Please try again.'
            });
        }

        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Failed to place order. Please try again.',
            error: error.message
        });
    }
});

// ===== GET ALL ORDERS =====
// GET /api/orders
router.get('/', async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get orders with pagination (status filter removed)
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v'); // Exclude version field

        // Get total count for pagination
        const total = await Order.countDocuments();

        res.json({
            success: true,
            page: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total,
            count: orders.length,
            orders: orders
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// ===== GET SINGLE ORDER =====
// GET /api/orders/:id
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);

        // Check if ID is valid
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// ===== UPDATE ORDER =====
// PUT /api/orders/:id (Updated - removed status updates)
router.put('/:id', async (req, res) => {
    try {
        const updates = {
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerPhone: req.body.customerPhone,
            drawingType: req.body.drawingType,
            size: req.body.size,
            price: req.body.price,
            description: req.body.description,
            specialInstructions: req.body.specialInstructions,
            paymentMethod: req.body.paymentMethod,
            deliveryDate: req.body.deliveryDate
            // Note: status and quantity updates removed
        };

        // Remove undefined fields
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log('✅ Order updated:', updatedOrder._id);

        res.json({
            success: true,
            message: 'Order updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error updating order:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update order',
            error: error.message
        });
    }
});

// ===== DELETE ORDER =====
// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log('✅ Order deleted:', deletedOrder._id);

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting order:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete order',
            error: error.message
        });
    }
});

// ===== GET ORDERS STATISTICS =====
// GET /api/orders/stats/summary (Updated - removed status-based calculations)
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$price' }, // Removed quantity multiplication
                    averageOrderValue: { $avg: '$price' }
                    // Note: status-based counts removed
                }
            }
        ]);

        // Get counts by drawing type
        const typeStats = await Order.aggregate([
            {
                $group: {
                    _id: '$drawingType',
                    count: { $sum: 1 },
                    revenue: { $sum: '$price' } // Removed quantity multiplication
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            summary: stats[0] || {
                totalOrders: 0,
                totalRevenue: 0,
                averageOrderValue: 0
            },
            byType: typeStats
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

module.exports = router;