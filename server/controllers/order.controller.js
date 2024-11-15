import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('products.productId')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Please provide valid products' });
    }

    // Verify stock and update product quantities
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = new Order({
      userId: req.user.id,
      products,
      totalAmount: products.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      orderDate: new Date()
    });
    
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('products.productId');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email')
     .populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order is cancelled, restore product stock
    if (status === 'cancelled') {
      for (let item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};