require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

const ask = (query, rl) => new Promise((resolve) => rl.question(query, resolve));

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dekave';
    await mongoose.connect(mongoUri);

    let [,, argEmail, argPassword, argUsername] = process.argv;

    let email = argEmail;
    let password = argPassword;
    let username = argUsername;

    if (!email || !password) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      console.log('\n=======================================');
      console.log('   🛠️  DKV Super Admin Generator');
      console.log('=======================================\n');

      if (!username) {
        username = (await ask('Masukkan Username [Super Admin DKV]: ', rl)).trim() || 'Super Admin DKV';
      }
      if (!email) {
        email = (await ask('Masukkan Email: ', rl)).trim();
      }
      if (!password) {
        password = (await ask('Masukkan Password (min. 6 karakter): ', rl)).trim();
      }
      rl.close();
    }

    if (!email || !password) {
      console.error('❌ Email dan Password wajib diisi!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password minimal 6 karakter!');
      process.exit(1);
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      user.username = username || user.username;
      user.password = password; // Will be re-hashed by pre('save')
      user.role = 'superadmin';
      await user.save();
      console.log(`\n✅ Akun Super Admin (${email}) BERHASIL DIUPDATE!`);
    } else {
      user = await User.create({
        username: username || 'Super Admin DKV',
        email: email.toLowerCase(),
        password,
        role: 'superadmin',
      });
      console.log(`\n🎉 Akun Super Admin baru (${email}) BERHASIL DIBUAT!`);
    }

    console.log(`- Username: ${user.username}`);
    console.log(`- Email   : ${user.email}`);
    console.log(`- Role    : ${user.role}`);
    console.log('\nSilakan login di halaman: http://localhost:5173/admin/login\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Terjadi kesalahan:', err.message);
    process.exit(1);
  }
};

run();
