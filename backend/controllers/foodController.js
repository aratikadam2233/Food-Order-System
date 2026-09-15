const Food = require('../models/Food');

// @route GET /api/foods
// Supports query params: search, category, sort ('price_asc','price_desc','rating_desc'), availableOnly
const getFoods = async (req, res, next) => {
  try {
    const { search, category, sort, availableOnly } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (availableOnly === 'true') {
      filter.available = true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Food.find(filter);

    switch (sort) {
      case 'price_asc':
        query = query.sort({ price: 1 });
        break;
      case 'price_desc':
        query = query.sort({ price: -1 });
        break;
      case 'rating_desc':
        query = query.sort({ rating: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    const foods = await query.exec();
    res.status(200).json({ success: true, message: 'Foods fetched successfully', data: foods });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/foods/:id
const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.status(200).json({ success: true, message: 'Food fetched successfully', data: food });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/foods (admin only)
const createFood = async (req, res, next) => {
  try {
    const { name, description, category, price, image, ingredients, rating, available } = req.body;

    if (!name || !description || !category || price === undefined || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, price and image are required',
      });
    }

    const food = await Food.create({
      name,
      description,
      category,
      price,
      image,
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : (ingredients || '').split(',').map((i) => i.trim()).filter(Boolean),
      rating: rating !== undefined ? rating : 4,
      available: available !== undefined ? available : true,
    });

    res.status(201).json({ success: true, message: 'Food added successfully', data: food });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/foods/:id (admin only)
const updateFood = async (req, res, next) => {
  try {
    const { ingredients } = req.body;
    const updates = { ...req.body };

    if (ingredients !== undefined) {
      updates.ingredients = Array.isArray(ingredients)
        ? ingredients
        : (ingredients || '').split(',').map((i) => i.trim()).filter(Boolean);
    }

    const food = await Food.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    res.status(200).json({ success: true, message: 'Food updated successfully', data: food });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/foods/:id (admin only)
const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.status(200).json({ success: true, message: 'Food deleted successfully', data: food });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood };
