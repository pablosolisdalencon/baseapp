// pages/api/pricings/[id].js
import { connectDB } from '@/utils/mongoose';
import Pricing from '@/models/Prices'; 
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  // Validar ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pricing ID'
    });
  }

  switch (req.method) {
    case 'GET':
      return getPricing(req, res, id);
    case 'PUT':
      return updatePricing(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getPricing(req, res, id) {
  try {
    const pricing = await Pricing.findById(id);

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pricing
    });

  } catch (error) {
    console.error('Error getting pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing',
      error: error.message
    });
  }
}

async function updatePricing(req, res, id) {
  try {
    const { action, price, description, category, isActive } = req.body;

    const updateData = {};
    if (action !== undefined) updateData.action = action;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be non-negative'
        });
      }
      updateData.price = price;
    }
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedPricing = await Pricing.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully',
      data: updatedPricing
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Action already exists'
      });
    }

    console.error('Error updating pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating pricing',
      error: error.message
    });
  }
}
