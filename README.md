# 🖼️ WebP to JPG Converter (Vercel Serverless)
This actually node server that actully convert the response of link of image from webp and anyother formate to jpeg/jpg.
There was a problem in uploading webp image on shopify store in bulk listing by using image link. So i made this and the image urls now returns image response in jpg formate.
This project is a simple **serverless image converter** hosted on [Vercel](https://vercel.com).  
It provides an API endpoint to convert images from **WebP** format to **JPG**, which is useful for platforms like **Shopify** that don’t fully support `.webp`.

---

## 🚀 Features
- Convert `.webp` images to `.jpg` instantly.
- Runs on **Vercel serverless functions** (no server setup needed).
- Public API endpoint — can be used directly in Shopify or other apps.
- Lightweight and fast.

---

## 📂 Folder Structure
```
webp-to-jpg-vercel/
├── api/
│   └── convert.js        # Serverless function (image converter)
├── vercel.json           # Vercel configuration (routes + builds)
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
```

---

## ⚙️ Installation (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/afaqfaiz/webp-to-jpg-vercel.git
cd webp-to-jpg-vercel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
vercel dev
```

Now open in your browser:
```
http://localhost:3000/api/convert?url=<image-link>
```

---

## 🚀 Deployment to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy (Preview)
```bash
vercel
```

This gives you a **preview URL** like:
```
https://your-project.vercel.app
```

### 3. Deploy to Production
```bash
vercel --prod
```

Your production endpoint will be:
```
https://webp-to-jpg-vercel.vercel.app/api/convert?url=<image-link>
```

---

## 🔗 Usage

### API Endpoint
```
GET /api/convert?url=<image-link>
```

### Example
Request:
```
https://webp-to-jpg-vercel.vercel.app/api/convert?url=https://example.com/sample.webp
```

Response:
- Returns the image converted to **JPG**.

👉 You can use this link **directly in Shopify** or anywhere that needs `.jpg` images.

---

## 📦 Dependencies
- [Node.js](https://nodejs.org/)
- [Sharp](https://sharp.pixelplumbing.com/) (for image conversion)
- [Axios](https://axios-http.com/) (for fetching images)
- [Vercel](https://vercel.com/docs) (for deployment)

---

## 📜 License
MIT License.  
You are free to use, modify, and share this project.

---

## 👨‍💻 Author
Developed by **[Aafaq Ahmad](aafaqahmadcs@gmail.com)**
