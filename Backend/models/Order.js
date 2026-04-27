// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // Customer Information
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    customerEmail: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    email: { type: String }, // Alias/backup for serverless req
    customerPhone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    phone: { type: String }, // Alias/backup for serverless req

    // Order Details
    drawingType: {
        type: String,
        required: [true, 'Drawing type is required']
    },
    size: {
        type: String,
        required: [true, 'Size is required']
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        min: [0, 'Price cannot be negative']
    },
    totalAmount: {
        type: Number,
        min: [0, 'Total amount cannot be negative']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
        default: ''
    },
    message: { type: String }, // Alias for description
    referenceImage: {
        type: String, // URL to uploaded image
        default: null
    },

    // Special Instructions
    specialInstructions: {
        type: String,
        maxlength: [500, 'Instructions cannot exceed 500 characters'],
        default: ''
    },

    // Payment Information
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online', 'bank_transfer'],
        default: 'online'
    },

    // Tracking - Removed status field
    orderNumber: {
        type: String,
        unique: true,
        default: function () {
            // Auto-generate order number: ORD-2024-TIMESTAMP-RANDOM format
            const date = new Date();
            const year = date.getFullYear();
            const timestamp = Date.now().toString().slice(-4);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `ORD-${year}-${timestamp}-${random}`;
        }
    },

    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'orders' // Set collection name to 'orders'
});

// Indexes for better performance (Removed status index)
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ customerEmail: 1 });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);