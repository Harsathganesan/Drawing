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
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    customerPhone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },

    // Order Details
    drawingType: {
        type: String,
        required: [true, 'Drawing type is required']
    },
    size: {
        type: String,
        required: [true, 'Size is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
        default: ''
    },
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

    // Payment Information (Removed status field, kept only payment related)
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
            // Auto-generate order number: ORD-2024-0001 format
            const date = new Date();
            const year = date.getFullYear();
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `ORD-${year}-${random}`;
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

module.exports = mongoose.model('Order', OrderSchema);