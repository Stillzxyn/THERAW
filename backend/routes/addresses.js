const express = require('express');
const Address = require('../models/Address');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all saved addresses for user
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get default address
router.get('/default', auth, async (req, res) => {
  try {
    const address = await Address.findOne({ userId: req.userId, isDefault: true });
    if (!address) {
      return res.status(404).json({ message: 'No default address set' });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save a new address
router.post('/', auth, async (req, res) => {
  try {
    const { label, fullName, email, phone, address, city, province, postalCode, isDefault } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !address || !city || !province || !postalCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ userId: req.userId }, { isDefault: false });
    }

    const newAddress = new Address({
      userId: req.userId,
      label: label || 'other',
      fullName,
      email,
      phone,
      address,
      city,
      province,
      postalCode,
      isDefault: isDefault || false
    });

    const savedAddress = await newAddress.save();
    console.log(`✓ Address saved for user ${req.userId}`);
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an address
router.put('/:id', auth, async (req, res) => {
  try {
    const { label, fullName, email, phone, address, city, province, postalCode, isDefault } = req.body;

    // Verify user owns this address
    const existingAddress = await Address.findById(req.params.id);
    if (!existingAddress || existingAddress.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // If setting as default, unset other defaults
    if (isDefault && !existingAddress.isDefault) {
      await Address.updateMany({ userId: req.userId }, { isDefault: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      {
        label: label || existingAddress.label,
        fullName: fullName || existingAddress.fullName,
        email: email || existingAddress.email,
        phone: phone || existingAddress.phone,
        address: address || existingAddress.address,
        city: city || existingAddress.city,
        province: province || existingAddress.province,
        postalCode: postalCode || existingAddress.postalCode,
        isDefault: isDefault !== undefined ? isDefault : existingAddress.isDefault
      },
      { new: true }
    );

    console.log(`✓ Address ${req.params.id} updated`);
    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an address
router.delete('/:id', auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address || address.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Address.findByIdAndDelete(req.params.id);
    console.log(`✓ Address ${req.params.id} deleted`);
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Set an address as default
router.patch('/:id/set-default', auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address || address.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Unset all other defaults
    await Address.updateMany({ userId: req.userId }, { isDefault: false });

    // Set this as default
    address.isDefault = true;
    await address.save();

    console.log(`✓ Address ${req.params.id} set as default`);
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
