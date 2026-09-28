# LENDMATE — Hourly Space Booking Platform 🏢⏱️

> **"Find a space. Book it by the hour."**

LendMate is a modern, responsive full-stack web application designed for campus and urban hourly rentals. People can list idle spaces (study pods, gaming lounges, meeting rooms, terraces, event halls, screening rooms) for short-duration rental, and other users can search, filter, view details, and book spaces by the hour with guaranteed **double-booking prevention**.

---

## 🚀 Live Demo & Ports
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express, REST API
- **Database**: SQLite (`lendmate.db`) using native `node:sqlite`
- **Language**: Pure JavaScript (clean, simple, zero TypeScript overhead)

---

## ✨ Features

### 1. User / Renter Flow
- **Home Page**: Modern startup landing page with hero banner, value props, category cards, and popular spaces around SRM & Chennai.
- **Browse Spaces**: Real-time multi-criteria filtering:
  - Search by name, landmark, or location
  - Category filter (Study Room, Hangout Space, Meeting Room, Party/Event Space, Terrace, Private Room)
  - Price per hour slider / filter
  - Capacity filter (seating)
  - Date & time availability filter
- **Space Details**:
  - High-res photography, hourly rates, verified amenities list, operating hours
  - Host contact information
  - Embedded interactive booking widget with date selector and available hours
  - Visual indicator of currently reserved slots
- **Instant Hourly Booking**:
  - Dynamic duration and price calculation based on chosen hours
  - **Double-Booking Overlap Shield**: Automatic conflict rejection if another booking overlaps
- **My Bookings**:
  - Filter by All, Confirmed, Cancelled
  - Reference numbers (`#LM-0000X`), time intervals, total price
  - 1-click **Cancel Booking** which immediately frees the slot back into circulation

### 2. Owner / Host Flow
- **Owner Dashboard**:
  - Key metrics: Total Listed Spaces, Total Confirmed Bookings, Gross Hourly Revenue
  - Tab 1: **My Listed Spaces** with individual booking counts and earnings
  - Tab 2: **Customer Bookings Log** with customer name, contact details, date, slot, and status
- **+ List a Space**:
  - Form to list new hourly spaces
  - Category, location, hourly rate, capacity, operating hours, amenities checklist
  - 1-click preset photography photos from Unsplash for quick demo testing

### 3. Demo Persona Switcher (Judge / Reviewer Friendly)
- 1-click switcher in the top navigation bar to switch between:
  - **Priya Sharma** (🎓 Student / Renter)
  - **Rajesh Kumar** (👑 Space Owner)
  - **Ananya Iyer** (👑 Space Owner)
  - **Rahul Verma** (🎓 Student / Renter)
- Also supports custom registration and login.

---

## 🛡️ Critical Double-Booking Overlap Logic

Double bookings are strictly prohibited on the backend using the standard interval overlap condition:
```sql
SELECT * FROM bookings
WHERE space_id = ?
  AND booking_date = ?
  AND status = 'confirmed'
  AND (start_time < ? AND end_time > ?)
```
*(with requested end time and start time passed respectively)*

If an overlap exists, the API rejects the request with HTTP **409 Conflict** and the exact message:
```json
{
  "error": "This space is already booked for the selected time."
}
```

---

## 📍 Seeded Spaces (Chennai / SRM University)
1. **The Silent Nook - Deep Work & Study Pod** (Potheri, Near SRM Main Gate) — ₹120/hr
2. **VibeDen SRM Chill & Gaming Lounge** (Estancia Townhouse, GST Road, Potheri) — ₹280/hr
3. **InnovateHub Boardroom & Presentation Suite** (GST Road, Guduvanchery) — ₹450/hr
4. **Skyline Rooftop Terrace & Open-Air Lounge** (Lakeview Enclave, Potheri) — ₹750/hr
5. **CinePrivé 4K Dolby Atmos Screening Pod** (Maraimalai Nagar, Chennai) — ₹500/hr
6. **GrandSphere Workshop & Mini Event Hall** (Kattankulathur Junction) — ₹1200/hr
7. **Zenith Creator Studio & Podcast Suite** (Abode Valley, Potheri) — ₹350/hr

---

## 🧪 Automated Test Suite
Run the test suite anytime:
```powershell
node server/src/test-api.js
```
All **19 test cases** cover:
- Health check
- Spaces directory and filtering
- Conflict detection (Inside, Start, End, and Engulfing overlaps)
- Operating hours boundary enforcement
- Accurate price calculations
- User reservations and cancellation
- Immediate slot re-booking after cancellation

---

## 🏃 Running the Project

### Start Backend:
```powershell
cd server
npm start
```
*(Runs on port 5000)*

### Start Frontend:
```powershell
cd client
npm run dev
```
*(Runs on port 3000)*

### Re-seed Database:
```powershell
cd server
npm run seed
```
