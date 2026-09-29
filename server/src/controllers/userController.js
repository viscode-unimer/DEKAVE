const User = require('../models/User');

// GET /api/users - List all contributors & superadmins
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ role: 1, createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// POST /api/users - Create new Contributor
const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, dan password wajib diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === 'superadmin' ? 'superadmin' : 'contributor',
    });

    res.status(201).json({
      success: true,
      message: `Akun ${user.role} (${user.username}) berhasil dibuat!`,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id - Update user details or reset password
const updateUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    if (username) user.username = username.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role && ['superadmin', 'contributor', 'admin'].includes(role)) {
      user.role = role;
    }
    if (password && password.trim().length >= 6) {
      user.password = password; // Trigger pre('save') hash
    }

    await user.save();

    res.json({
      success: true,
      message: 'Data pengguna berhasil diperbarui!',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id - Delete a contributor
const deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Tidak dapat menghapus akun Anda sendiri' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({ success: true, message: `Akun ${user.username} berhasil dihapus` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
