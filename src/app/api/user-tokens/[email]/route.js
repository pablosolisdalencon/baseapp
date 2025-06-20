import { connectDB } from '../../utils/mongoose';
import UserTokens from '../../models/UserTokens';

export default async function handler(req, res) {
  await connectDB();

  const { email } = req.query;

  // Validar email
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email parameter is required'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  switch (req.method) {
    case 'GET':
      return getUserTokensByEmail(req, res, email);
    case 'PUT':
      return updateUserTokens(req, res, email);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getUserTokensByEmail(req, res, email) {
  try {
    const userTokens = await UserTokens.findOne({ 
      email: email.toLowerCase() 
    });

    if (!userTokens) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: userTokens
    });

  } catch (error) {
    console.error('Error getting user tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user tokens',
      error: error.message
    });
  }
}

async function updateUserTokens(req, res, email) {
  try {
    const { 
      tokens, 
      totalPurchased, 
      totalSpent, 
      plan, 
      isActive,
      operation = 'set' // 'set', 'add', 'subtract'
    } = req.body;

    const updateData = {};
    
    // Manejar diferentes tipos de operaciones para tokens
    if (tokens !== undefined) {
      if (operation === 'add') {
        updateData.$inc = { tokens: tokens };
      } else if (operation === 'subtract') {
        updateData.$inc = { tokens: -Math.abs(tokens) };
      } else {
        updateData.tokens = tokens;
      }
    }

    // Otros campos siempre se actualizan directamente
    if (totalPurchased !== undefined) {
      updateData.totalPurchased = totalPurchased;
    }
    if (totalSpent !== undefined) {
      updateData.totalSpent = totalSpent;
    }
    if (plan !== undefined) updateData.plan = plan;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    updateData.lastActivity = new Date();

    const updatedUserTokens = await UserTokens.findOneAndUpdate(
      { email: email.toLowerCase() },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUserTokens) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User tokens updated successfully',
      data: updatedUserTokens
    });

  } catch (error) {
    console.error('Error updating user tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user tokens',
      error: error.message
    });
  }
}
