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
    const { username, fullName, email, password, role, division, notes } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, dan password wajib diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
    const existing = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: cleanUsername },
      ],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: existing.email === email.toLowerCase().trim() ? 'Email sudah terdaftar' : 'Username sudah digunakan',
      });
    }

    const user = await User.create({
      username: cleanUsername,
      fullName: (fullName || username).trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === 'superadmin' ? 'superadmin' : 'contributor',
      status: 'active', // Direct creation by Superadmin is automatically active
      division: division ? division.trim() : 'Umum',
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: `Akun ${user.role} (${user.username}) berhasil dibuat!`,
      data: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        division: user.division,
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
    const { username, fullName, email, password, role, status, division, notes } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    if (username) user.username = username.trim().toLowerCase().replace(/\s+/g, '_');
    if (fullName !== undefined) user.fullName = fullName.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role && ['superadmin', 'contributor', 'admin'].includes(role)) {
      user.role = role;
    }
    if (status && ['active', 'pending', 'rejected'].includes(status)) {
      user.status = status;
    }
    if (division !== undefined) user.division = division.trim();
    if (notes !== undefined) user.notes = notes.trim();
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
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        division: user.division,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/:id/status - Approve or reject contributor account (Superadmin ACC)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    user.status = status;
    await user.save();

    const statusLabel = status === 'active' ? 'DISETUJUI (ACC)' : status === 'rejected' ? 'DITOLAK' : 'PENDING';

    res.json({
      success: true,
      message: `Status akun @${user.username} berhasil diubah menjadi: ${statusLabel}!`,
      data: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
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

module.exports = { getUsers, createUser, updateUser, updateUserStatus, deleteUser };
