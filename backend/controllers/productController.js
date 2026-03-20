const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary, isConfigured } = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const query = { isActive: true };
    if (category && category !== 'all') query.category = category.toLowerCase();
    if (featured === 'true') query.featured = true;
    if (search) query.$text = { $search: search };

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / Number(limit));
    const products = await Product.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, count: products.length, total, pages, currentPage: Number(page), products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, description, stock, featured, imageUrl } = req.body;

    const productData = {
      name,
      price: Number(price),
      category,
      description,
      stock: Number(stock),
      featured: featured === 'true' || featured === true,
    };

    if (req.file) {
      // File uploaded — try Cloudinary, fall back to placeholder
      if (isConfigured) {
        const result = await uploadToCloudinary(req.file.buffer);
        if (result) {
          productData.image = result.secure_url;
          productData.imagePublicId = result.public_id;
        }
      } else {
        // Cloudinary not set up — use a default placeholder
        console.log('⚠️  File received but Cloudinary not configured. Using placeholder.');
        productData.image = `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(name.slice(0, 20))}`;
      }
    } else if (imageUrl && imageUrl.trim()) {
      // Admin pasted an image URL directly
      productData.image = imageUrl.trim();
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { name, price, category, description, stock, featured, isActive, imageUrl } = req.body;

    const updateData = {};
    if (name      !== undefined) updateData.name      = name;
    if (price     !== undefined) updateData.price     = Number(price);
    if (category  !== undefined) updateData.category  = category;
    if (description !== undefined) updateData.description = description;
    if (stock     !== undefined) updateData.stock     = Number(stock);
    if (featured  !== undefined) updateData.featured  = featured === 'true' || featured === true;
    if (isActive  !== undefined) updateData.isActive  = isActive === 'true' || isActive === true;

    if (req.file) {
      if (isConfigured) {
        if (product.imagePublicId) await deleteFromCloudinary(product.imagePublicId);
        const result = await uploadToCloudinary(req.file.buffer);
        if (result) {
          updateData.image = result.secure_url;
          updateData.imagePublicId = result.public_id;
        }
      } else {
        updateData.image = `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent((name || product.name).slice(0, 20))}`;
      }
    } else if (imageUrl && imageUrl.trim()) {
      updateData.image = imageUrl.trim();
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (soft)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.isActive = false;
    await product.save();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories with counts
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };