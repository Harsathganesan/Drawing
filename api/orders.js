const connectDB = require('../Backend/config/db');
const Order = require('../Backend/models/Order');

module.exports = async (req, res) => {
  // 1. Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed. Use POST.` 
    });
  }

  try {
    // 4. Connect to Database
    await connectDB();

    // 5. Extract data from request body
    const { 
      customerName, 
      email, 
      phone, 
      drawingType, 
      size, 
      quantity, 
      totalAmount, 
      message 
    } = req.body;

    // 6. Basic Validation
    if (!customerName || !email || !phone || !drawingType || !size || !totalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // 7. Create and save order
    const orderData = {
      customerName,
      customerEmail: email, // Map to model field
      email,               // Optional backup
      customerPhone: phone, // Map to model field
      phone,               // Optional backup
      drawingType,
      size,
      quantity: quantity || 1,
      price: totalAmount,    // Map to model field
      totalAmount,          // Optional backup
      description: message || '',
      message               // Optional backup
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    console.log('✅ Order saved in Vercel Serverless:', savedOrder._id);

    // 8. Return Success Response
    return res.status(201).json({
      success: true,
      message: '✅ Order placed successfully!',
      orderId: savedOrder._id,
      orderNumber: savedOrder.orderNumber
    });

  } catch (error) {
    console.error('❌ SERVERLESS ERROR:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}
