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
          title: 'Poster & Identitas Festival Budaya Merangin',
          description: 'Desain poster promosi dan materi visual komprehensif untuk merayakan kekayaan budaya dan tradisi lokal Merangin.',
          category: 'Desain Grafis & Poster',
          images: [
            'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
          ],
          creator: 'Rian Pratama',
          tags: ['poster', 'identity', 'culture', 'desain'],
          isFeatured: true,
        },
        {
          title: 'Dokumentasi Visual Hunting Senja Danau Pauh',
          description: 'Rangkaian jepretan lanskap senja dan aktivitas nelayan lokal di Danau Pauh Merangin.',
          category: 'Fotografi & Dokumentasi',
          images: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
          ],
          creator: 'Siti Nurhaliza',
          tags: ['photography', 'landscape', 'danau', 'merangin'],
          isFeatured: true,
        },
        {
          title: 'Video Profil Kreatif UKM DKV Universitas Merangin',
          description: 'Produksi video sinematik pendek berdurasi 60 detik yang memperkenalkan dinamika dan semangat berkarya keluarga DKV.',
          category: 'Videografi & Sinematik',
          images: [
            'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
          ],
          creator: 'Fikri Haikal',
          tags: ['videography', 'reels', 'cinematic', 'kampus'],
          isFeatured: true,
        },
        {
          title: 'Kampanye Media Sosial: DKV Ramah Pemula',
          description: 'Rancangan materi feeds publikasi dan kampanye keterbukaan UKM DKV untuk seluruh mahasiswa baru Universitas Merangin.',
          category: 'Konten Media & Publikasi',
          images: [
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
          ],
          creator: 'Dewi Lestari',
          tags: ['humas', 'pr', 'campaign', 'medsos'],
          isFeatured: true,
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
          name: 'Mutia Chandra',
          position: 'Ketua',
          division: 'Desain',
          photo: '',
          year: 2024,
          instagram: 'muchann__',
          isActive: true,
        },
        {
          name: 'Rifki Pratama',
          position: 'Koordinator',
          division: 'Photography',
          photo: '',
          year: 2024,
          instagram: 'rifki.photo',
          isActive: true,
        },
        {
          name: 'Dimas Kurniawan',
          position: 'Koordinator',
          division: 'Videography',
          photo: '',
          year: 2024,
          instagram: 'dimas.films',
          isActive: true,
        },
        {
          name: 'Siti Rahmawati',
          position: 'Koordinator',
          division: 'Public Relation',
          photo: '',
          year: 2024,
          instagram: 'siti_rahma',
          isActive: true,
        },
      ]);
      console.log('👥 Sample members created with Mutia Chandra as Ketua and 4 divisions.');
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
