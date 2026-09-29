# DEKAVE — UKM DKV Universitas Merangin

> *"Ideas Become Reality, Visuals Become Stories"*

## Tech Stack
- **Frontend**: Vue.js 3 + Vite 5 + Tailwind CSS 3 + vue-i18n 9
- **State**: Pinia
- **HTTP**: Axios
- **Editor**: TipTap
- **Backend**: Express.js + MongoDB (Mongoose)
- **Image Storage**: Cloudinary

## Getting Started

### 1. Backend
```bash
cd server
cp .env.example .env
# Fill in your MongoDB URI and Cloudinary credentials
npm install
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

## Features
- 🎨 Portfolio gallery with category filter
- 📅 Events display (view only)
- ✍️ Blog with TipTap rich text editor
- 👥 Member profiles gallery
- 🎓 CAMAVIS registration form (Calon Mahasiswa Viscode)
- 🌙☀️ Dark / Light mode toggle (Pinia + localStorage)
- 🌐 Bilingual: Indonesia & English (vue-i18n)
- 🔐 Admin panel with JWT authentication

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── blog/
│   │   │   └── TiptapEditor.vue
│   │   └── common/
│   │       ├── Footer.vue
│   │       ├── LoadingSpinner.vue
│   │       ├── Navbar.vue
│   │       └── PublicLayout.vue
│   ├── locales/
│   │   ├── en.json
│   │   └── id.json
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── auth.js
│   │   └── theme.js
│   ├── utils/
│   │   ├── api.js
│   │   └── formatDate.js
│   ├── views/
│   │   ├── admin/
│   │   │   ├── AdminLayout.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── Login.vue
│   │   │   ├── ManageBlog.vue
│   │   │   ├── ManageCamavis.vue
│   │   │   ├── ManageEvent.vue
│   │   │   ├── ManageMember.vue
│   │   │   └── ManagePortfolio.vue
│   │   ├── About.vue
│   │   ├── Blog.vue
│   │   ├── BlogDetail.vue
│   │   ├── Camavis.vue
│   │   ├── Contact.vue
│   │   ├── Event.vue
│   │   ├── EventDetail.vue
│   │   ├── Home.vue
│   │   ├── Member.vue
│   │   ├── Portfolio.vue
│   │   └── PortfolioDetail.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env
├── index.html
├── tailwind.config.js
└── vite.config.js
```
