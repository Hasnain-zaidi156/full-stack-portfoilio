# Portfolio — Full Stack (React + Node/Express + MongoDB)

Is project mein 2 folders hain:

- `frontend/` — React + Vite portfolio (Netlify par deploy hoga)
- `backend/`  — Express API (projects, likes & comments, images) (Render par deploy hoga)

Theme "Iron & Copper" (dark charcoal + steel-blue/copper accents) aur custom cursor bhi add kiya gaya hai.


---

## 1. Local mein chalana

### Backend
```bash
cd backend
npm install
cp .env.example .env
# .env file mein MONGO_URI, ADMIN_KEY aur FRONTEND_URL daalein
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


## 3. Backend Deploy — Render

1. [render.com](https://render.com) par account banayein, GitHub repo connect karein
2. "New Web Service" → repo select karein → **Root Directory: `backend`**
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables add karein (Render dashboard mein):
   - `PORT` = `5000`
   - `FRONTEND_URL` = apka Netlify URL (e.g. `https://your-site.netlify.app`)
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

- ✅ Form mein Phone Number field (optional) + spam-protection honeypot field
- ✅ Naya unique color theme "Iron & Copper" (`src/style/Global.css` ke CSS variables se)
- ✅ Custom animated cursor (desktop only, mobile par off)
- ✅ Navbar active-link bug fix (`Link` → `NavLink`)
- ✅ Contact section: WhatsApp / Call / Email / LinkedIn / GitHub cards (form nahi)
- ✅ `express-rate-limit` trust-proxy fix (Render ke reverse proxy ke liye)
- ✅ `.env` / `.env.example` dono taraf
- ✅ `render.yaml` + `netlify.toml` (SPA redirect ke sath)

---

## Pictures — `npm run images`

- `cd frontend && npm run images` (ya `cd backend && npm run images`):
  - `portfolioData.js` ki saari remote pics (ibb.co wagera) download karke `frontend/public/images/` mein rakhta hai aur data file mein link local path (`/images/...`) se badal deta hai
  - `backend/pictures/` ki pics bhi `public/images/` mein copy karta hai
  - saari pics MongoDB (`images` collection) mein save karta hai — `backend/.env` mein `MONGO_URI` chahiye, aur pehle `cd backend && npm install`
  - `src/utils/imagesMap.js` dobara bana deta hai
- Flags: `--force` (dobara download), `--no-db` (DB skip)
- DB se pic dekhne ke liye: `GET /api/images` (list) aur `GET /api/images/<key>`
- `npm run dev` / `npm run build` sirf imagesMap.js refresh karte hain (offline, Netlify safe)

---

## Admin Panel (Projects manage karna)

Site ka `/admin` page (e.g. `https://your-site.netlify.app/admin`) — login `ADMIN_KEY` (backend env) se hota hai, wahi key jo comments delete karne ke liye pehle se use ho rahi hai.

Yahan se kar sakte hain:
- Project **add / edit / delete**
- **Pic**: computer se upload (auto chhoti ho kar database mein save hoti hai) ya koi bhi pic ka link
- Title, description, tags, category, Live Demo link, GitHub link, icon
- Projects ki **tarteeb** (↑ ↓)

**Pehli dafa:** `/admin` par login karein → "Import projects" dabayein. Isse `portfolioData.js` ke purane projects database mein aa jaate hain (sirf ek dafa, aur sirf tab jab database mein koi project na ho). Uske baad Projects page, Resume page aur Resume PDF — teeno database se chalte hain. Backend band ho ya database na mile to site `portfolioData.js` ki list dikha deti hai.

Likes/comments project ke `slug` se bandhe hain, isliye title badalne par bhi purane likes/comments safe rehte hain.

Backend API: `GET /api/projects` (public); `POST/PUT/DELETE /api/projects`, `PUT /api/projects/reorder`, `POST /api/projects/:id/image`, `POST /api/projects/seed` (header `x-admin-key`).

## Netlify badge

`frontend/src/utils/hideNetlifyBadge.js` ("Powered by Netlify" badge hatata hai — `#nl-badge`, `.nl-badge`, `aria-label` aur shadow DOM sab handle) — `main.jsx` mein chalta hai, aur `index.html` mein ek chhota backup bhi hai.

## Vercel deploy (frontend)

- Root Directory: `frontend`, Framework: Vite (Build `npm run build`, Output `dist`)
- Env variable: `VITE_API_URL` = Render backend URL (bina `/` ke) — env badalne ke baad **Redeploy** zaroori hai
- `frontend/vercel.json` `/admin` aur `/resume` jaise routes refresh par 404 hone se bachata hai
- Backend (Render) mein `FRONTEND_URL` = Vercel ka **Domains** wala URL (e.g. `https://my-portflio-phi.vercel.app`), lamba deployment URL nahi

## Backend bhi Vercel par (Render ki zaroorat nahi)

1. Vercel → **Add New Project** → wahi GitHub repo → **Root Directory: `backend`** → Framework: *Other* → Deploy
   (`backend/vercel.json` + `backend/api/index.js` Express app ko serverless function bana dete hain)
2. Backend project ke **Environment Variables** mein daalein: `FRONTEND_URL`, `MONGO_URI`, `ADMIN_KEY` (`PORT` ki zaroorat nahi), phir **Redeploy**
   - `FRONTEND_URL` = frontend ka URL (e.g. `https://hasnain-zaidi.vercel.app`), bina `/` ke
3. Backend ka URL (e.g. `https://hasnain-backend.vercel.app`) frontend project ki `VITE_API_URL` mein daalein → **Redeploy**
4. Check: `https://<backend>.vercel.app/health` → `status: ok`, `db: connected`
5. MongoDB Atlas → Network Access → `0.0.0.0/0` allow karein (Vercel ke IP fixed nahi hote)

Note: Vercel request body limit ~4.5 MB hai, isliye admin panel mein upload ki hui pic max 2.5 MB (browser pehle hi auto chhoti kar deta hai).
