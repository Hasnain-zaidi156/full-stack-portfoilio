# Portfolio — Full Stack (React + Node/Express + Nodemailer)

Is project mein 2 folders hain:

- `frontend/` — React + Vite portfolio (Netlify par deploy hoga)
- `backend/`  — Express + Nodemailer API jo contact form ka email bhejta hai (Render par deploy hoga)

Naya theme "Sunset Aurora" (violet background + orange/pink/purple accents) aur custom cursor bhi add kiya gaya hai.

---

## 1. Local mein chalana

### Backend
```bash
cd backend
npm install
cp .env.example .env
# .env file mein apna EMAIL_USER, EMAIL_PASS (Gmail App Password) aur OWNER_EMAIL daalein
npm start
```
Backend `http://localhost:5000` par chalega.

### Frontend
```bash
cd frontend
npm install
# .env pehle se hai VITE_API_URL=http://localhost:5000 ke sath
npm run dev
```

---

## 2. Gmail App Password kaise banayen

1. Gmail account mein 2-Step Verification on karein: https://myaccount.google.com/security
2. App Passwords page kholein: https://myaccount.google.com/apppasswords
3. "Mail" ke liye password generate karein (16 characters)
4. Yehi password backend ke `.env` mein `EMAIL_PASS` mein daalein (apna normal Gmail password nahi)

Agar Gmail use nahi karna to `.env.example` mein diye gaye `SMTP_*` variables use karein (koi bhi SMTP provider).

---

## 3. Backend Deploy — Render

1. [render.com](https://render.com) par account banayein, GitHub repo connect karein
2. "New Web Service" → repo select karein → **Root Directory: `backend`**
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables add karein (Render dashboard mein):
   - `PORT` = `5000` (Render khud bhi apna PORT deta hai, dono chalta hai)
   - `FRONTEND_URL` = apka Netlify URL (e.g. `https://your-site.netlify.app`)
   - `EMAIL_SERVICE` = `gmail`
   - `EMAIL_USER` = apka Gmail address
   - `EMAIL_PASS` = App Password
   - `OWNER_EMAIL` = jahan notification aani hai
6. Deploy karein — Render apko ek URL dega jaise `https://portfolio-backend.onrender.com`

`render.yaml` file bhi di gayi hai agar "Blueprint" deploy use karna ho.

---

## 4. Frontend Deploy — Netlify

1. [netlify.com](https://netlify.com) par account banayein, GitHub repo connect karein
2. **Base directory: `frontend`**
3. Build command: `npm run build`
4. Publish directory: `frontend/dist` (ya sirf `dist` agar base directory `frontend` set hai)
5. Environment variable add karein:
   - `VITE_API_URL` = apka Render backend URL (e.g. `https://portfolio-backend.onrender.com`)
6. Deploy karein

`netlify.toml` mein SPA redirect already set hai, is liye route refresh par 404 nahi aayega.

---

## 5. Deploy ke baad

- Backend deploy hone ke baad Render URL copy karein → Netlify env var `VITE_API_URL` mein daal kar re-deploy karein
- Frontend deploy hone ke baad Netlify URL copy karein → Render env var `FRONTEND_URL` mein daal kar backend restart karein (CORS ke liye zaroori hai)

---

## Kya naya add hua hai

- ✅ Nodemailer se functional contact form (owner ko notification + sender ko auto-reply)
- ✅ Form mein Phone Number field (optional) + spam-protection honeypot field
- ✅ Naya unique color theme "Iron & Copper" (`src/style/Global.css` ke CSS variables se)
- ✅ Custom animated cursor (desktop only, mobile par off)
- ✅ Navbar active-link bug fix (`Link` → `NavLink`)
- ✅ Fully responsive contact form
- ✅ `.env` / `.env.example` dono taraf
- ✅ `render.yaml` + `netlify.toml` (SPA redirect ke sath)
