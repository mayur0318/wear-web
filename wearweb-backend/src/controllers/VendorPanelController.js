const vendorSchema = require("../models/VendorModel");
const productSchema = require("../models/ProductModel");
const orderSchema = require("../models/OrderModel");
const reviewSchema = require("../models/ReviewModel");
const userSchema = require("../models/UserModel");
const uploadToCloudinary = require("../utils/CoudinaryUtils");

// DASHBOARD
const getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    const products = await productSchema.find({ vendorId });
    const productIds = products.map((p) => p._id.toString());

    // Filter orders that contain vendor's products
    let orders = await orderSchema.find().populate("items.productId").populate("customerId");
    let vendorOrders = [];
    let totalRevenue = 0;
    let pendingOrdersCount = 0;

    orders.forEach((order) => {
      let containsVendorProduct = false;
      let orderVendorTotal = 0;
      
      order.items.forEach((item) => {
        const productVal = item.productId?._id || item.productId;
        if (!productVal) return; // Skip if product ID is missing
        const pid = String(productVal);
        if (productIds.includes(pid)) {
          containsVendorProduct = true;
          // Use quantity/price from Order items
          orderVendorTotal += (item.quantity * item.price);
        }
      });

      if (containsVendorProduct) {
        vendorOrders.push(order);
        if (order.orderStatus === "placed") {
          pendingOrdersCount++;
        }
        if (order.orderStatus === "delivered") {
          totalRevenue += orderVendorTotal;
        }
      }
    });

    const lowStockAlerts = products.filter(p => p.stock < 5);

    res.status(200).json({
      message: "Dashboard stats fetched",
      data: {
        totalProducts: products.length,
        totalOrders: vendorOrders.length,
        pendingOrders: pendingOrdersCount,
        totalRevenue: totalRevenue,
        recentOrders: vendorOrders.slice(-5).reverse(), // Last 5 orders
        lowStockAlerts: lowStockAlerts
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
  }
};

// PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await productSchema.find({ vendorId: req.vendorId }).populate("categoryId");
    res.status(200).json({ message: "Vendor products", data: products });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { productName, description, price, size, color, stock, categoryId } = req.body;
    let imagePath = "";

    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.path);
      imagePath = cloudinaryResponse.secure_url;
    }

    const newProduct = await productSchema.create({
      productName,
      productDescription: description,
      productPrice: price,
      productSize: size,
      productColor: color,
      stock,
      categoryId,
      imagePath,
      vendorId: req.vendorId
    });

    res.status(201).json({ message: "Product created", data: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productSchema.findOne({ _id: req.params.id, vendorId: req.vendorId });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    const { productName, description, price, size, color, stock, categoryId } = req.body;
    
    let updateData = {
      productName,
      productDescription: description,
      productPrice: price,
      productSize: size,
      productColor: color,
      stock,
      categoryId
    };

    // Remove undefined fields just in case
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.path);
      updateData.imagePath = cloudinaryResponse.secure_url;
    }

    const updatedProduct = await productSchema.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.status(200).json({ message: "Product updated", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productSchema.findOneAndDelete({ _id: req.params.id, vendorId: req.vendorId });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });
    
    res.status(200).json({ message: "Product deleted", data: product });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await productSchema.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.vendorId },
      { stock: stock },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });
    res.status(200).json({ message: "Stock updated", data: product });
  } catch (err) {
    res.status(500).json({ message: "Error updating stock", error: err.message });
  }
};

// ORDERS
const getOrders = async (req, res) => {
  try {
    const products = await productSchema.find({ vendorId: req.vendorId });
    const productIds = products.map((p) => p._id.toString());
    
    let allOrders = await orderSchema.find().populate("customerId").populate("items.productId");
    let vendorOrders = [];

    allOrders.forEach((order) => {
      let containsVendorProduct = false;
      let vendorOrderTotal = 0;
      let vendorProductsInOrder = [];
      
      order.items.forEach((item) => {
        const productVal = item.productId?._id || item.productId;
        if (!productVal) return; // Skip if missing
        const pid = String(productVal);
        if (productIds.includes(pid)) {
          containsVendorProduct = true;
          vendorOrderTotal += (item.quantity * item.price);
          vendorProductsInOrder.push(item);
        }
      });

      if (containsVendorProduct) {
        // Return mostly full order data but tailored slightly contextually if needed
        vendorOrders.push({
          ...order.toObject(),
          vendorTotalAmount: vendorOrderTotal,
          vendorItems: vendorProductsInOrder
        });
      }
    });

    res.status(200).json({ message: "Vendor orders", data: vendorOrders });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving orders", error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderSchema.findById(orderId).populate("customerId").populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ensure it belongs to vendor
    const products = await productSchema.find({ vendorId: req.vendorId });
    const productIds = products.map(p => p._id.toString());

    order.items.forEach((item) => {
      const productVal = item.productId?._id || item.productId;
      if (!productVal) return;
      const pid = String(productVal);
      if (productIds.includes(pid)) containsVendorProduct = true;
    });

    if (!containsVendorProduct) {
      return res.status(403).json({ message: "Unauthorized access to this order" });
    }

    res.status(200).json({ message: "Order details", data: order });
  } catch (err) {
    res.status(500).json({ message: "Error fetching order detail", error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    // Basic array check match ["placed", "shipped", "delivered", "cancelled"]
    const validStatuses = ["placed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: "Invalid order status" });
    }

    const orderId = req.params.id;
    const order = await orderSchema.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const products = await productSchema.find({ vendorId: req.vendorId });
    const productIds = products.map(p => p._id.toString());

    order.items.forEach((item) => {
      const productVal = item.productId?._id || item.productId;
      if (!productVal) return;
      const pid = String(productVal);
      if (productIds.includes(pid)) containsVendorProduct = true;
    });

    if (!containsVendorProduct) {
      return res.status(403).json({ message: "Unauthorized to update this order" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ message: "Order status updated", data: order });
  } catch(err) {
    res.status(500).json({ message: "Error updating order status", error: err.message });
  }
};

// REPORTS
const getReports = async (req, res) => {
  try {
    const products = await productSchema.find({ vendorId: req.vendorId });
    const productIds = products.map((p) => p._id.toString());
    
    let allOrders = await orderSchema.find();
    
    let totalRevenue = 0;
    let counts = { placed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    let productSalesMap = {}; // { productId: qty }

    allOrders.forEach(order => {
       let orderBelongsToVendor = false;
       order.items.forEach(item => {
           const productVal = item.productId?._id || item.productId;
           if (!productVal) return;
           const pid = String(productVal);
           if (productIds.includes(pid)) {
               orderBelongsToVendor = true;
               
               if (order.orderStatus === "delivered") {
                  totalRevenue += (item.price * item.quantity);
               }

               if (!productSalesMap[pid]) {
                   productSalesMap[pid] = 0;
               }
               productSalesMap[pid] += item.quantity;
           }
       });

       if (orderBelongsToVendor) {
           if (counts[order.orderStatus] !== undefined) {
               counts[order.orderStatus]++;
           }
       }
    });

    // Top 3 products
    let topProductIds = Object.entries(productSalesMap).sort((a,b) => b[1] - a[1]).slice(0, 3);
    let topProducts = [];
    for (let i = 0; i < topProductIds.length; i++) {
        let p = products.find(prod => prod._id.toString() === topProductIds[i][0]);
        if(p) {
            topProducts.push({
                productName: p.productName,
                totalSold: topProductIds[i][1],
                revenue: topProductIds[i][1] * p.productPrice
            });
        }
    }

    res.status(200).json({ 
        message: "Sales reports",
        data: {
           totalRevenue,
           orderCounts: counts,
           topProducts
        }
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating reports", error: err.message });
  }
};

// REVIEWS
const getReviews = async (req, res) => {
  try {
    const products = await productSchema.find({ vendorId: req.vendorId });
    const productIds = products.map(p => p._id.toString());
    
    const reviews = await reviewSchema.find({ productId: { $in: productIds } })
                                      .populate("productId", "productName")
                                      .populate({
                                         path: "customerId", 
                                         populate: { path: "userId", select: "name" }
                                      });
    res.status(200).json({ message: "Vendor reviews", data: reviews });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

// PROFILE
const getProfile = async (req, res) => {
  try {
    const vendor = await vendorSchema.findOne({ userId: req.userId }).populate("userId", "name email phoneNo");
    res.status(200).json({ message: "Vendor profile", data: vendor });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

const updateProfile = async (req, res) => {
    try {
        const { shopName, address, name, phoneNo } = req.body;
        
        await vendorSchema.findOneAndUpdate({ userId: req.userId }, { shopName, address });
        await userSchema.findByIdAndUpdate(req.userId, { name, phoneNo, address });
        
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
};

module.exports = {
  getDashboardStats,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getReports,
  getReviews,
  getProfile,
  updateProfile
};
