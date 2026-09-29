const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dekave';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n⚠️  KONEKSI MONGODB GAGAL:');
    console.error(`Detail error: ${error.message}`);
    console.error('\nTips penyelesaian:');
    console.error('1. Jika pakai MongoDB Lokal: Pastikan aplikasi MongoDB / service MongoDB sudah aktif di PC.');
    console.error('2. Jika pakai MongoDB Atlas (Cloud): Masukkan URI connection string di file server/.env pada MONGODB_URI=...');
    console.error('--------------------------------------------------\n');
  }
};

module.exports = connectDB;
