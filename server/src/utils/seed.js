require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Event = require('../models/Event');
const Blog = require('../models/Blog');
const Member = require('../models/Member');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dekave';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding...');

    // 1. Seed or Update Superadmin
    const superadminEmail = 'viscode0um@gmail.com';
    let superadmin = await User.findOne({ email: superadminEmail });
    if (!superadmin) {
      superadmin = await User.create({
        username: 'Superadmin DKV',
        email: superadminEmail,
        password: 'dkvunimersuperadmin', // Hashed by pre('save')
        role: 'superadmin',
      });
      console.log(`👤 Superadmin user created: ${superadminEmail} / dkvunimersuperadmin`);
    } else {
      superadmin.password = 'dkvunimersuperadmin';
      superadmin.role = 'superadmin';
      superadmin.username = 'Superadmin DKV';
      await superadmin.save();
      console.log(`👤 Superadmin user updated: ${superadminEmail} / dkvunimersuperadmin`);
    }

    // 2. Seed Sample Portfolios if empty
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      await Portfolio.create([
        {
          title: 'Identitas Visual Festival Budaya Merangin',
          description: 'Desain branding dan identitas visual komprehensif untuk merayakan kekayaan budaya dan tradisi lokal Merangin.',
          category: 'Branding',
          images: [
            'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
          ],
          creator: 'Rian Pratama',
          tags: ['branding', 'identity', 'culture', 'typography'],
          isFeatured: true,
        },
        {
          title: 'Ilustrasi Cerita Rakyat Danau Pauh',
          description: 'Karya ilustrasi digital yang mengisahkan legenda eksotis Danau Pauh dengan perpaduan warna neon mistis.',
          category: 'Illustration',
          images: [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
          ],
          creator: 'Siti Nurhaliza',
          tags: ['illustration', 'digitalart', 'folklore'],
          isFeatured: true,
        },
        {
          title: 'Redesign UI/UX Mobile App Pariwisata Merangin',
          description: 'Konsep antarmuka aplikasi mobile pariwisata yang ramah pengguna, modern, dan mudah dinavigasi wisatawan.',
          category: 'UI/UX',
          images: [
            'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80',
          ],
          creator: 'Fikri Haikal',
          tags: ['uiux', 'mobileapp', 'clean', 'modern'],
          isFeatured: true,
        },
        {
          title: 'Eksplorasi Tipografi Geopark Merangin',
          description: 'Karya tipografi eksperimental yang terinspirasi dari struktur batu fosil purba di Geopark Merangin.',
          category: 'Branding',
          images: [
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
          ],
          creator: 'Dewi Lestari',
          tags: ['typography', 'geopark', 'design'],
          isFeatured: false,
        },
      ]);
      console.log('🎨 Sample portfolios created.');
    }

    // 3. Seed Sample Events if empty
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.create([
        {
          title: 'Workshop Tipografi Kreatif 2026',
          description: 'Pelajari dasar-dasar hierarki tipografi dan cara membuat custom lettering bersama praktisi industri desain ternama.',
          type: 'Workshop',
          date: new Date('2026-10-15T09:00:00Z'),
          location: 'Aula Gedung Rektorat Lt. 2, Universitas Merangin',
          poster: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
          isActive: true,
        },
        {
          title: 'Pameran Karya Tahunan "Viscode Reality"',
          description: 'Pameran visual terbesar karya mahasiswa DKV Universitas Merangin, menampilkan poster, instalasi, dan desain interaktif.',
          type: 'Pameran',
          date: new Date('2026-11-20T10:00:00Z'),
          location: 'Creative Hub DKV, Kampus Utama Universitas Merangin',
          poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
          isActive: true,
        },
      ]);
      console.log('📅 Sample events created.');
    }

    // 4. Seed Sample Blog if empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.create([
        {
          title: 'Mengapa Komposisi Visual Menentukan Keberhasilan Desain Kamu',
          slug: 'mengapa-komposisi-visual-menentukan-keberhasilan-desain-kamu',
          content: '<h2>Fondasi Komposisi Visual</h2><p>Komposisi adalah susunan elemen-elemen visual dalam suatu karya. Tanpa komposisi yang terencana, pesan yang ingin disampaikan bisa hilang atau membingungkan audiens.</p><h3>1. Rule of Thirds</h3><p>Membagi kanvas menjadi sembilan bagian yang sama dan meletakkan elemen kunci pada titik potong untuk menciptakan keseimbangan alami.</p><h3>2. Hierarki Visual</h3><p>Menentukan elemen apa yang pertama kali harus dilihat mata pengguna, melalui perbedaan ukuran, warna kontras, atau posisi.</p><blockquote>"Ideas become reality, visuals become stories — setiap garis dan warna punya arti tersendiri."</blockquote>',
          thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
          author: 'Divisi Edukasi DKV',
          tags: ['tips', 'komposisi', 'visual', 'tutorial'],
          isPublished: true,
        },
      ]);
      console.log('✍️ Sample blogs created.');
    }

    // 5. Seed Sample Members if empty
    const memberCount = await Member.countDocuments();
    if (memberCount === 0) {
      await Member.create([
        {
          name: 'Muhammad Arya',
          position: 'Ketua Umum',
          division: 'Badan Pengurus Harian',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          year: 2023,
          instagram: '@arya.viscode',
          isActive: true,
        },
        {
          name: 'Nadia Putri',
          position: 'Wakil Ketua',
          division: 'Badan Pengurus Harian',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
          year: 2023,
          instagram: '@nadiaptr',
          isActive: true,
        },
        {
          name: 'Kevin Pratama',
          position: 'Koordinator',
          division: 'Divisi Branding & Media',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
          year: 2024,
          instagram: '@kevin_dkv',
          isActive: true,
        },
        {
          name: 'Annisa Rahma',
          position: 'Koordinator',
          division: 'Divisi Ilustrasi & Animasi',
          photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
          year: 2024,
          instagram: '@annisa.arts',
          isActive: true,
        },
      ]);
      console.log('👥 Sample members created.');
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
