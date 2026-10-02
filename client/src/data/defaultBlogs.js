// Default seed data for DKV Journal / Blogs
// Represents all 4 official divisions plus 2 storytelling articles for Divisi Public Relation (PR)

export const defaultBlogs = [
  {
    _id: 'blog-1-divisi-desain',
    title: 'Eksplorasi Visual: Dari Sketsa Kasar Menuju Identitas Desain yang Berkarakter',
    slug: 'eksplorasi-visual-dari-sketsa-kasar-menuju-identitas-desain-yang-berkarakter',
    division: 'Desain',
    author: 'Mutia Chandra (Divisi Desain)',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Desain Grafis', 'Tipografi', 'Branding', 'Kreatif'],
    excerpt: 'Mengupas proses kreatif di balik layar Divisi Desain: dari kebebasan coretan sketsa manual di sketchbook hingga melahirkan karya visual dan identitas brand yang berkarakter kuat.',
    isPublished: true,
    createdAt: '2026-09-18T10:00:00.000Z',
    content: `
      <h2>Menemukan Titik Temu Antara Ide dan Eksekusi Visual</h2>
      <p>Dalam dunia Desain Komunikasi Visual (DKV), sebuah karya yang memikat tidak pernah lahir secara instan dalam satu klik software. Di Divisi Desain DKV Universitas Merangin, kami selalu meyakini bahwa software seperti Adobe Illustrator, Photoshop, maupun Figma hanyalah kuas modern—sementara jiwa dari karya tersebut terletak pada proses eksplorasi konseptual yang mendalam.</p>
      
      <h3>1. Kekuatan Sketsa Manual di Atas Kertas</h3>
      <p>Sebelum menyentuh kursor dan kanvas digital, langkah sakral pertama setiap anggota divisi desain adalah membuka sketchbook fisik. Sketsa manual memberikan kebebasan berpikir tanpa distraksi shortcut tools atau batasan grid digital. Garis-garis kasar, coretan ide tak beraturan, dan thumbnail sketches membantu kita mengevaluasi puluhan sudut pandang komposisi dalam hitungan menit.</p>

      <h3>2. Membangun Hierarki Visual dan Anatomi Tipografi</h3>
      <p>Setelah arah konsep visual terpilih, kami melangkah ke fase penataan hierarki. Desain yang berhasil adalah desain yang mampu memandu pandangan mata audiens secara terstruktur:</p>
      <ul>
        <li><strong>Focal Point:</strong> Elemen dominan yang menarik perhatian dalam 3 detik pertama (headline atau ilustrasi kunci).</li>
        <li><strong>Secondary Elements:</strong> Informasi pendukung seperti tanggal, lokasi, atau sub-judul yang melengkapi konteks.</li>
        <li><strong>Anatomi Font Pairing:</strong> Mengombinasikan serif yang berwibawa dengan sans-serif yang bersih dan modern untuk menjaga legibilitas tinggi.</li>
      </ul>

      <h3>3. Harmoni Palet Warna dan Eksperimen Bentuk</h3>
      <p>Warna bukan sekadar hiasan visual, melainkan psikologi emosi. Di UKM DKV, kami belajar mengeksplorasi perpaduan palet warna kontras seperti deep obsidian, aksen cyan bercahaya, dan sentuhan neon yang energik untuk mencerminkan identitas generasi muda yang adaptif terhadap tren visual global.</p>

      <blockquote>
        "Desain yang baik bukan tentang menambahkan sebanyak mungkin ornamen, melainkan ketika tidak ada lagi elemen yang bisa dihilangkan tanpa merusak pesan intinya."
        <br><span style="font-size: 0.85em; opacity: 0.8;">— Tim Divisi Desain DKV</span>
      </blockquote>

      <p>Melalui proses inilah, setiap poster, visual identity, dan merchandise yang dirilis oleh DKV bukan hanya enak dipandang, tetapi memiliki bobot narasi yang kuat dan berkarakter.</p>
    `
  },
  {
    _id: 'blog-2-divisi-photography',
    title: 'Menangkap Esensi di Balik Lensa: Komposisi, Cahaya, dan Cerita Tanpa Kata',
    slug: 'menangkap-esensi-di-balik-lensa-komposisi-cahaya-dan-cerita-tanpa-kata',
    division: 'Photography',
    author: 'Zhelicha Ayu Joya (Divisi Photography)',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    tags: ['Photography', 'Komposisi', 'Lensa', 'Hunting Foto'],
    excerpt: 'Melihat dunia lewat jendela viewfinder kamera: cara fotografer DKV membaca arah cahaya alami, mengatur leading lines, dan menangkap momen spontan yang jujur.',
    isPublished: true,
    createdAt: '2026-09-22T14:30:00.000Z',
    content: `
      <h2>Dunia Lewat Jendela Viewfinder</h2>
      <p>Bagi Divisi Photography DKV Universitas Merangin, kamera adalah perpanjangan dari cara kami mengamati kehidupan di sekitar kita. Fotografi bukan semata-mata tentang spesifikasi megapixel atau lensa bernilai jutaan rupiah, melainkan tentang kepekaan mata dan ketajaman rasa dalam membekukan sepersekian detik momen yang tidak akan pernah terulang.</p>

      <h3>1. Berburu Keajaiban Cahaya Alami (The Magic of Natural Light)</h3>
      <p>Cahaya adalah bahan baku utama fotografer. Dalam agenda rutin photo-hunting anak DKV—baik di sudut kampus Universitas Merangin maupun lanskap alam Merangin seperti Danau Pauh—kami selalu memperhatikan pergerakan matahari:</p>
      <ul>
        <li><strong>Golden Hour:</strong> Cahaya hangat keemasan sesaat setelah fajar atau sebelum terbenam yang memberikan dimensi dramatis dan bayangan lembut.</li>
        <li><strong>Blue Hour:</strong> Nuansa biru pekat sesaat setelah senja, ideal untuk menghasilkan potret bertema misterius dan sinematik.</li>
        <li><strong>Harsh Daylight:</strong> Memanfaatkan bayangan tajam siang hari untuk eksplorasi fotografi monokrom dan geometri arsitektur.</li>
      </ul>

      <h3>2. Seni Komposisi: Rule of Thirds hingga Negative Space</h3>
      <p>Komposisi adalah bahasa universal fotografi. Kami melatih anggota untuk tidak selalu menaruh objek tepat di tengah bingkai. Menggunakan <em>Rule of Thirds</em>, mencari <em>leading lines</em> alami dari garis lorong kampus, serta memanfaatkan <em>negative space</em> yang luas memungkinkan foto bernafas dan memberikan fokus penuh kepada subjek.</p>

      <h3>3. The Decisive Moment: Merekam Emosi yang Murni</h3>
      <p>Foto terbaik seringkali lahir dari momen spontan (candid). Tawa lepas kawan-kawan saat berdiskusi, ekspresi keseriusan mahasiswa saat menggoreskan kuas, hingga tatapan mata penuh harapan. Ketika teknik pencahayaan dan emosi manusia bertemu di ujung sensor kamera, di situlah sebuah foto bertransformasi menjadi cerita abadi.</p>

      <blockquote>
        "Kamera adalah instrumen yang mengajarkan orang bagaimana cara melihat dunia tanpa bantuan kamera."
        <br><span style="font-size: 0.85em; opacity: 0.8;">— Dorothea Lange (Mantra Divisi Photography DKV)</span>
      </blockquote>
    `
  },
  {
    _id: 'blog-3-divisi-videography',
    title: 'Ritme Sinematik: Bagaimana Kami Menghidupkan Cerita Lewat Visual Bergerak',
    slug: 'ritme-sinematik-bagaimana-kami-menghidupkan-cerita-lewat-visual-bergerak',
    division: 'Videography',
    author: 'Suci Nabiha (Divisi Videography)',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    tags: ['Videography', 'Sinematik', 'Editing', 'Reels'],
    excerpt: 'Membongkar alur produksi video kreatif di DKV: dari storyboard pra-produksi yang matang, pergerakan dinamis kamera, hingga sihir sound design yang menyentuh emosi.',
    isPublished: true,
    createdAt: '2026-09-25T08:15:00.000Z',
    content: `
      <h2>Sihir 24 Frame per Detik</h2>
      <p>Dalam rentang satu dekade terakhir, video telah berkembang menjadi medium komunikasi paling berpengaruh di dunia digital. Di Divisi Videography DKV, kami tidak hanya merekam aktivitas dengan tripod dan menekan tombol record. Misi kami adalah meramu gambar bergerak, warna, ritme potongan (editing cut), dan tata suara menjadi pengalaman visual yang menggetarkan penonton.</p>

      <h3>1. Pra-Produksi: Mematangkan Storyboard Sebelum Syuting</h3>
      <p>Pepatah di ruang editing kami berbunyi: <em>'70% keberhasilan video ditentukan di atas meja pra-produksi.'</em> Sebelum membawa gear ke lokasi, kami menyusun shot list dan storyboard terperinci:</p>
      <ul>
        <li><strong>Establishing Shot:</strong> Membuka ruang dan memperkenalkan atmosfer lingkungan kepada penonton.</li>
        <li><strong>Medium & Close-Up:</strong> Mendekatkan penonton dengan emosi subjek dan detail aksi kreatif anggota.</li>
        <li><strong>B-Roll Eksploratif:</strong> Potongan footage pendukung seperti tetesan cat, putaran lensa, hingga senyuman spontan yang memperkaya transisi.</li>
      </ul>

      <h3>2. Camera Movement yang Punya Makna</h3>
      <p>Setiap pergerakan kamera harus memiliki motivasi psikologis. Kami membiasakan anggota memadukan penggunaan gimbal stabilizer yang mengalir halus dengan teknik <em>handheld camera</em> dinamis untuk memberi kesan realistis, dekat, dan penuh energi muda.</p>

      <h3>3. The Soul of Video: Sound Design dan Ritme Potongan</h3>
      <p>Banyak pemula mengira video hanya urusan mata, padahal 50% dampak emosional video ditentukan oleh telinga penonton. Melalui sinkronisasi ketukan audio (beat matching), ambient soundscape kampus, dan sound effects (SFX) foley seperti derit pintu atau hembusan angin, video promosi DKV dan aftermovie event terasa begitu hidup dan mengalir alami.</p>

      <blockquote>
        "Visual memikat mata, tetapi ritme dan suara adalah sayap yang menerbangkan pesan langsung ke dalam hati audiens."
        <br><span style="font-size: 0.85em; opacity: 0.8;">— Tim Videografi DKV</span>
      </blockquote>
    `
  },
  {
    _id: 'blog-4-divisi-public-relation',
    title: 'Membangun Suara Komunitas: Strategi Humas DKV di Tengah Arus Informasi Digital',
    slug: 'membangun-suara-komunitas-strategi-humas-dkv-di-tengah-arus-informasi-digital',
    division: 'Public Relation',
    author: 'Desri Yanti Safitri (Divisi Public Relation)',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    tags: ['Public Relation', 'Branding', 'Komunikasi', 'Medsos'],
    excerpt: 'Humas bukan sekadar penyebar pengumuman. Inilah strategi Divisi PR DKV dalam merancang tone of voice bersahabat, editorial calendar medsos, dan diplomasi kolaborasi kampus.',
    isPublished: true,
    createdAt: '2026-09-27T16:00:00.000Z',
    content: `
      <h2>Humas Bukan Sekadar Tukang Siar Pengumuman</h2>
      <p>Banyak orang mengira tugas Public Relation (PR) atau Humas hanyalah membagikan poster event ke grup WhatsApp kampus. Di UKM DKV Universitas Merangin, paradigma tersebut kami ubah total. Divisi Public Relation adalah narator utama—jembatan strategis yang menghubungkan ratusan karya brilian dari anggota divisi teknis dengan dunia luar.</p>

      <h3>1. Merancang Persona dan Tone of Voice yang Ramah</h3>
      <p>Di era di mana media sosial dipenuhi konten monoton, DKV memilih persona yang hangat, inklusif, dan menginspirasi. Kami memastikan setiap salinan teks (copywriting) di Instagram <code>@viscode_um</code> dan TikTok tidak terasa kaku seperti pengumuman birokrasi, melainkan seperti obrolan akrab antarmahasiswa yang sama-sama mencintai dunia kreatif.</p>

      <h3>2. Editorial Calendar dan Distribusi Konten Multi-Platform</h3>
      <p>Strategi publikasi kami didasarkan pada riset perilaku audiens mahasiswa:</p>
      <ul>
        <li><strong>Instagram Feed:</strong> Etalase portofolio prestisius, showcase karya unggulan anggota, dan pengumuman resmi event.</li>
        <li><strong>Instagram Stories & Reels:</strong> Konten raw, behind-the-scenes proses produksi, kuis interaktif, dan highlight kegiatan harian.</li>
        <li><strong>TikTok Viscode:</strong> Konten kreatif berformat pendek, tips desain santai, dan tren visual terkini yang relevan dengan Gen Z.</li>
      </ul>

      <h3>3. Menjaga Hubungan Baik dengan Mitra Kampus dan Komunitas Luar</h3>
      <p>PR juga menjadi garda terdepan dalam menjalin relasi diplomatis dengan pimpinan kampus Universitas Merangin, UKM mitra, organisasi mahasiswa regional Jambi, hingga para sponsor. Bagi kami, setiap jabat tangan dan proposal adalah peluang memperluas panggung bagi kawan-kawan kreator DKV.</p>

      <blockquote>
        "Karya yang luar biasa tanpa komunikasi yang baik akan terkubur dalam sunyi. Tugas kami adalah memastikan setiap tetes kreativitas kawan-kawan didengar dan diapresiasi dunia."
        <br><span style="font-size: 0.85em; opacity: 0.8;">— Desri Yanti Safitri, Koordinator PR DKV</span>
      </blockquote>
    `
  },
  {
    _id: 'blog-5-cerita-pr-admin-medsos',
    title: 'Catatan Tengah Malam Sang Admin: Dinamika di Balik Layar Medsos & Liputan Kilat DKV',
    slug: 'catatan-tengah-malam-sang-admin-dinamika-di-balik-layar-medsos-liputan-kilat-dkv',
    division: 'Public Relation',
    author: 'Citra Dunanti (Divisi Public Relation)',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cerita PR', 'Behind The Scenes', 'Diary Humas', 'Kisah Nyata'],
    excerpt: 'Kisah seru dan haru di balik layar admin akun @viscode_um: kepanikan baterai 5% saat pameran akbar kampus, begadang menunggu render aftermovie, dan senyum di kolom notifikasi.',
    isPublished: true,
    createdAt: '2026-09-29T23:15:00.000Z',
    content: `
      <h2>"Min, Pendaftaran CAMAVIS Masih Buka Nggak Ya?"</h2>
      <p>Jam di sudut layar ponsel sudah menunjukkan pukul 00.32 WIB. Suasana sekretariat DKV Universitas Merangin mulai hening, hanya tersisa bunyi ketikan keyboard dan desing kipas laptop anak-anak video yang masih sibuk merender footage aftermovie. Di genggaman tanganku, lampu notifikasi Instagram <code>@viscode_um</code> berkedip tanpa henti.</p>
      <p>Pertanyaan dari calon mahasiswa baru seperti di atas bukan satu-satunya. Ada yang bertanya rekomendasi laptop untuk desain, ada yang malu-malu menanyakan apakah boleh ikut DKV kalau belum bisa menggambar, bahkan ada yang curhat kebingungan memilih divisi. Dan itulah sekelumit dunia kami sebagai pengurus Divisi Public Relation.</p>

      <h3>Kisah Dramatis Live Report di Pameran Akbar</h3>
      <p>Jika orang melihat feeds Instagram kami tampak rapi dan estetik, izinkan aku menceritakan apa yang terjadi beberapa minggu lalu saat pameran karya tahunan kampus. Hari itu aula utama Universitas Merangin dipadati ratusan pengunjung dari berbagai fakultas.</p>
      <p>Seketika itu juga, situasi mendadak genting: <em>baterai handphone tim peliput tersisa 5%, kabel roll pengisi daya tertinggal di lantai dua, dan ketua pameran sudah bersiap memotong pita tanda acara resmi dibuka!</em></p>
      <p>Tanpa pikir panjang, aku dan kawan-kawan PR langsung berbagi peran secepat kilat. Satu orang berlari kencang mengambil powerbank cadangan, satu orang meminjam hotspot seluler karena sinyal WiFi aula tiba-tiba tumbang akibat lonjakan pengunjung, dan aku langsung bersiaga mengambil shot video vertikal detik-detik pembukaan.</p>
      <p>Hasilnya? Dalam waktu kurang dari 15 menit pasca acara dibuka, update Instagram Story dan highlight reels kami sudah tayang dengan kualitas prima. Penonton luar kampus yang berhalangan hadir langsung membanjiri kolom DM dengan ungkapan takjub.</p>

      <h3>Kopi Hangat, Revisi Caption, dan Kekeluargaan</h3>
      <p>Menjadi admin medsos bukan hanya soal memposting gambar. Seringkali kami harus berdebat santai dengan tim desain hanya untuk menentukan satu kata di dalam caption, memastikan tidak ada typo nama narasumber, atau mencari sound TikTok yang sedang trending agar video teman-teman videografi bisa menjangkau ribuan penonton.</p>
      <p>Di balik lelahnya begadang dan layar smartphone yang tak pernah tidur, ada rasa hangat yang sulit diungkapkan dengan kata-kata. Saat postingan karya kawan-kawan kita tembus ratusan likes, saat ada maba yang berkata, <em>'Kak, berkat postingan DKV aku jadi berani belajar desain'</em>—semua rasa lelah itu menguap seketika.</p>

      <blockquote>
        "Bagi orang luar, ini mungkin hanya postingan medsos 15 detik. Namun bagi kami anak PR, ini adalah rangkuman tawa, keringat, dan dedikasi kami untuk keluarga kecil bernama DKV."
        <br><span style="font-size: 0.85em; opacity: 0.8;">— Catatan Harian Citra Dunanti, Tim Humas & Medsos</span>
      </blockquote>
    `
  },
  {
    _id: 'blog-6-cerita-pr-kolaborasi-pertama',
    title: 'Dari Gugup Menjadi Bangga: Cerita Pertama Kali Menjalin Kolaborasi untuk Viscode',
    slug: 'dari-gugup-menjadi-bangga-cerita-pertama-kali-menjalin-kolaborasi-untuk-viscode',
    division: 'Public Relation',
    author: 'Desri Yanti Safitri (Divisi Public Relation)',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cerita PR', 'Kolaborasi', 'Jejak Langkah', 'Pengalaman'],
    excerpt: 'Catatan personal pertama kali membawa map proposal sponsorship DKV ke instansi luar: mengatasi rasa gemetar di ruang rapat hingga bangga membawa pulang kesepakatan kerjasama.',
    isPublished: true,
    createdAt: '2026-10-01T11:45:00.000Z',
    content: `
      <h2>Map Proposal yang Terasa Seberat Batu</h2>
      <p>Pagi itu, cuaca kota Bangko cukup terik. Aku berdiri di depan cermin sekretariat, merapikan kemeja almamater Universitas Merangin dengan tangan yang sedikit gemetar. Di dalam tas jinjingku, tersimpan lima berkas proposal sponsorship dan portfolio karya DKV yang telah dicetak rapi semalaman.</p>
      <p>Sebagai mahasiswa yang terbiasa duduk di balik meja kuliah, hari itu adalah kali pertama aku ditugaskan mewakili organisasi untuk beraudiensi dengan pimpinan instansi dan mitra kreatif lokal di Merangin. Rasa cemas dan ragu berputar di kepalaku: <em>'Bagaimana kalau mereka menolak proposal kami? Bagaimana jika mereka menganggap UKM desain mahasiswa hanyalah kegiatan sampingan biasa?'</em></p>

      <h3>Meja Rapat dan Detak Jantung yang Berpacu</h3>
      <p>Memasuki ruang pertemuan ber-AC dingin dengan meja rapat kayu yang formal, rasa gugupku memuncak. Pihak manajemen duduk di hadapan kami dengan tatapan profesional dan pertanyaan-pertanyaan yang to-the-point mengenai keuntungan apa yang bisa didapatkan jika mereka mensponsori pameran seni DKV.</p>
      <p>Di saat itulah aku teringat kawan-kawan di divisi lain. Aku teringat anak-anak Desain yang rela tidak tidur demi merampungkan konsep katalog, anak Photography yang kehujanan saat hunting foto, dan anak Videografi yang matanya merah di depan layar monitor. Beban rasa gugup itu mendadak luruh, tergantikan oleh rasa tanggung jawab yang membakar semangat.</p>

      <h3>Momen Magis: Saat Lembar Portofolio Dibuka</h3>
      <p>Alih-alih hanya membacakan rincian anggaran biaya, aku memutuskan membuka lembaran portofolio karya anggota DKV di hadapan mereka. Aku menceritakan cerita di balik poster Festival Budaya Merangin, memutarkan teaser video berdurasi 30 detik yang digarap kawan-kawan, dan memaparkan bagaimana media sosial DKV aktif menjangkau ribuan mahasiswa muda di Merangin.</p>
      <p>Ekspresi pimpinan mitra seketika berubah. Beliau tersenyum, mengangguk kagum, dan berkata:</p>
      <blockquote>
        "Saya tidak menyangka mahasiswa kita di Merangin punya kualitas karya visual sebagus dan semodern ini. Kami tentu siap mendukung penuh pameran kalian."
      </blockquote>

      <h3>Sebuah Pelajaran Berharga tentang Keberanian</h3>
      <p>Melangkah keluar dari gedung pertemuan dengan surat kerjasama yang telah ditandatangani adalah momen paling membanggakan dalam perjalanan organisasiku. Dari pengalaman berharga ini, aku belajar satu hal penting:</p>
      <p>Public Relation bukan tentang kefasihan berbicara tanpa arah atau sekadar merayu sponsor. Humas adalah tentang rasa percaya diri terhadap nilai karya kawan-kawan sendiri, keberanian untuk mengetuk pintu peluang, dan kemampuan menyulut keyakinan orang lain bahwa mimpi kreatif anak-anak muda pantas diberi ruang untuk bersinar.</p>

      <p>Dan hari itu, nama DKV / Viscode Universitas Merangin kembali melangkah satu tapak lebih maju.</p>
    `
  }
];

export const getBlogBySlug = (slug) => {
  if (!slug) return null;
  const s = String(slug).toLowerCase().trim();
  return defaultBlogs.find(b => 
    b.slug === s || 
    b._id === s ||
    s.includes(b.slug) ||
    b.slug.includes(s) ||
    b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === s
  ) || null;
};
