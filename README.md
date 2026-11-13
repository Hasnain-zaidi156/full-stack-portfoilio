# Portfolio — Full Stack (React + Node/Express + Brevo API)

Is project mein 2 folders hain:

- `frontend/` — React + Vite portfolio (Netlify par deploy hoga)
- `backend/`  — Express API jo contact form ka email bhejta hai (Render par deploy hoga)

Theme "Iron & Copper" (dark charcoal + steel-blue/copper accents) aur custom cursor bhi add kiya gaya hai.

⚠️ **Important:** Email bhejne ke liye ye project Brevo ki **HTTP API** use karta hai, SMTP nahi — kyunki Render (aur zyadatar free-tier hosts) outbound SMTP ports (25/465/587) block karte hain. HTTP API HTTPS par chalti hai jo kabhi block nahi hoti.

---

## 1. Local mein chalana

### Backend
```bash
cd backend
npm install
cp .env.example .env
# .env file mein apna BREVO_API_KEY, FROM_EMAIL aur OWNER_EMAIL daalein
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

## 2. Brevo setup kaise karein

1. [brevo.com](https://brevo.com) par free account banayein
2. **API Key**: Settings → SMTP & API → API Keys tab → "Generate a new API key" (ye `xkeysib-` se shuru hoti hai) → `.env` mein `BREVO_API_KEY` mein daalein
3. **Sender verify karein**: [app.brevo.com/senders](https://app.brevo.com/senders) → "Add a sender" → apna email daalein → us email par aaya verification link kholein. Bas isi verified email se hi `FROM_EMAIL` set ho sakta hai, warna Brevo mail reject kar dega
4. `OWNER_EMAIL` mein wo email daalein jahan "new message" ki notification aani chahiye

---

## 3. Backend Deploy — Render

1. [render.com](https://render.com) par account banayein, GitHub repo connect karein
2. "New Web Service" → repo select karein → **Root Directory: `backend`**
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables add karein (Render dashboard mein):
   - `PORT` = `5000`
   - `FRONTEND_URL` = apka Netlify URL (e.g. `https://your-site.netlify.app`)
   - `BREVO_API_KEY` = apki Brevo API key
   - `FROM_EMAIL` = apka verified sender email
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
- Render ke Logs tab mein "Mailer ready ✅ (Brevo HTTP API)" dikhna chahiye

---

## Kya naya add hua hai

- ✅ Brevo HTTP API se functional contact form (owner ko notification + sender ko auto-reply) — Render ke free-tier SMTP block se bachne ke liye
- ✅ Form mein Phone Number field (optional) + spam-protection honeypot field
- ✅ Naya unique color theme "Iron & Copper" (`src/style/Global.css` ke CSS variables se)
- ✅ Custom animated cursor (desktop only, mobile par off)
- ✅ Navbar active-link bug fix (`Link` → `NavLink`)
- ✅ Fully responsive contact form
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
