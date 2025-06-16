# FindProducts

## 🇨🇿 Česká verze

### Popis

FindProducts je webová aplikace pro správu a vyhledávání produktů. Umožňuje uživatelům přihlásit se pomocí Google účtu, vytvářet, upravovat a mazat produkty, a vyhledávat v existujících produktech.

### Funkce

- 🔐 Přihlášení přes Google
- 🌓 Tmavý/světlý režim
- 📝 Vytváření produktů
- 🔍 Vyhledávání produktů
- ✏️ Úprava produktů
- 🗑️ Mazání produktů
- 📱 Responzivní design

### Technologie

- Frontend: React.js
- Backend: Node.js, Express
- Databáze: MongoDB
- Autentizace: Google OAuth

### Instalace

1. Naklonujte repozitář

```bash
git clone https://github.com/vas-username/FindProducts.git
```

2. Nainstalujte závislosti pro backend

```bash
cd backend
npm install
```

3. Nainstalujte závislosti pro frontend

```bash
cd ../frontend
npm install
```

4. Vytvořte soubor `.env` v adresáři `backend` s následujícím obsahem:

```
MONGODB_URI=vaše_mongodb_uri
PORT=5000
JWT_SECRET=váš_jwt_secret
GOOGLE_CLIENT_ID=váš_google_client_id
GOOGLE_CLIENT_SECRET=váš_google_client_secret
FRONTEND_URL=http://localhost:3000
```

### Spuštění

1. Spusťte backend server

```bash
cd backend
npm start
```

2. Spusťte frontend aplikaci

```bash
cd frontend
npm start
```

Aplikace bude dostupná na `http://localhost:3000`

---

## 🇬🇧 English Version

### Description

FindProducts is a web application for managing and searching products. It allows users to sign in with their Google account, create, edit, and delete products, and search through existing products.

### Features

- 🔐 Google Sign-in
- 🌓 Dark/Light mode
- 📝 Product creation
- 🔍 Product search
- ✏️ Product editing
- 🗑️ Product deletion
- 📱 Responsive design

### Technologies

- Frontend: React.js
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Google OAuth

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/FindProducts.git
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the `backend` directory with the following content:

```
MONGODB_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

### Running

1. Start the backend server

```bash
cd backend
npm start
```

2. Start the frontend application

```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

---

# 🛍️ FindProducts (product store.app)

A full-stack MERN (MongoDB, Express, React, Node) web application that allows users to browse, add, make deal if soldable product are the with the owner associated with that product and manage products. Users can log in via Google and manage their own products securely.



## 🚀 Features

- 🔐 Google Authentication (OAuth)
- ✅ JWT-based user sessions
- 🛒 Product CRUD operations
- 🧑‍💼 Users can manage only their own products
- 🎨 Clean React.js frontend (Vite)
- 🌐 Deployed on Render

---

## 📁 Project Structure

```
Findproducts/
├── backend/              # Node.js + Express API
├── frontend/             # React.js client (Vite)
├── .env                  # Environment variables
├── package.json          # Root package file
└── node_modules/
```

---

## ⚙️ Tech Stack

- **Frontend:** React.js, Vite, Axios, Tailwind CSS (if used)
- **Backend:** Node.js, Express, Mongoose
- **Auth:** Google OAuth 2.0 + JWT
- **Database:** MongoDB Atlas
- **Deployment:** Render

---

## 🛠️ Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/tilahungoito/Findproducts.git
cd Findproducts
```

2. **Setup the backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Then run the server:

```bash
npm run dev
```

3. **Setup the frontend**

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Make sure your `.env` file in the backend contains:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
```

---

## 📦 API Endpoints

- `POST /api/auth/google` – Google login
- `GET /api/products` – Get all products
- `POST /api/products` – Create product (auth required)
- `PUT /api/products/:id` – Update product (auth required)
- `DELETE /api/products/:id` – Delete product (auth required)

---

## 📌 Todo / Future Features

- Image upload (Cloudinary, etc.)
- Pagination & filtering
- Admin dashboard
- User profiles

---
