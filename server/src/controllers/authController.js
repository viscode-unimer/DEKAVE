const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const login = async (req, res, next) => {
  try {
    const { email, username, identifier, password } = req.body;
    const loginInput = (identifier || email || username || '').trim();

    if (!loginInput || !password) {
      return res.status(400).json({
        success: false,
        message: 'Mohon masukkan email atau username dan password',
      });
    }

    // Search by email or username (case-insensitive)
    const escapedInput = loginInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({
      $or: [
        { email: loginInput.toLowerCase() },
        { username: new RegExp(`^${escapedInput}$`, 'i') },
      ],
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Email/username atau password yang Anda masukkan salah',
      });
    }

    // Check account status
    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda masih dalam status PENDING menunggu persetujuan (ACC) dari Superadmin.',
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Pendaftaran akun Anda telah ditolak oleh Superadmin. Hubungi pengurus untuk informasi lebih lanjut.',
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName || user.username,
        email: user.email,
        role: user.role,
        status: user.status || 'active',
        division: user.division || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

const registerContributor = async (req, res, next) => {
  try {
    const { username, fullName, email, password, division, notes } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, dan password wajib diisi',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal terdiri dari 6 karakter',
      });
    }

    if (/\s/.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username tidak boleh mengandung spasi. Hanya boleh menggunakan simbol underscore (_)',
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Username hanya boleh menggunakan kombinasi huruf, angka, dan simbol underscore (_)',
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username minimal 3 karakter (huruf, angka, atau underscore)',
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email tersebut sudah terdaftar di sistem. Gunakan email lain.',
      });
    }

    // Check existing username
    const existingUsername = await User.findOne({
      username: new RegExp(`^${cleanUsername}$`, 'i'),
    });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username sudah digunakan. Silakan gunakan username lain.',
      });
    }

    const user = await User.create({
      username: cleanUsername,
      fullName: (fullName || username).trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'contributor',
      status: 'pending', // Requires Superadmin ACC
      division: division ? division.trim() : 'Desain',
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Pendaftaran kontributor berhasil! Akun Anda sedang menunggu persetujuan (ACC) dari Superadmin.',
      data: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { login, registerContributor, getMe, logout };
