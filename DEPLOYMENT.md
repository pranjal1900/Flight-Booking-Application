# 🚀 Deployment Guide (For Resume Demo)

This guide walks you through deploying the **Flight Booking System** online for free using **MongoDB Atlas**, **Render (Backend)**, and **Vercel (Frontend)**.

---

## 1. MongoDB Atlas Setup (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g. `admin` and a strong password).
4. Under **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** -> **Drivers**, and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/flight_booking?retryWrites=true&w=majority
   ```

---

## 2. Deploy Backend on Render (Free Tier)
1. Push your code to GitHub.
2. Sign up at [Render.com](https://render.com/).
3. Click **New +** -> **Web Service**, and connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Under **Environment Variables**, add:
   - `MONGO_URL` = `<your-mongodb-atlas-connection-string>`
   - `JWT_SECRET_KEY` = `<your-secret-key>`
   - `NODE_ENV` = `production`
6. Click **Create Web Service**. Save your backend URL (e.g. `https://flight-booking-api.onrender.com`).

---

## 3. Deploy Frontend on Vercel / Netlify
1. Sign up at [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**, select your GitHub repository.
3. Set the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Under **Environment Variables**, add:
   - `VITE_BACKEND_URL` = `https://flight-booking-api.onrender.com` (Your Render backend URL)
5. Click **Deploy**.

---

## 🎉 Done!
Your live website URL is ready to be added to your resume and portfolio!
