const { db, initSchema } = require('./database');

function seedDatabase() {
  initSchema();

  console.log('Clearing old data (if any)...');
  db.exec(`
    DELETE FROM bookings;
    DELETE FROM spaces;
    DELETE FROM users;
  `);

  console.log('Seeding users...');
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, role, phone)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Owner 1: Rajesh Kumar
  insertUser.run(1, 'Rajesh Kumar', 'rajesh@srmspaces.in', 'owner', '+91 98401 23456');
  // Owner 2: SRM Space Hub (Ananya)
  insertUser.run(2, 'Ananya Iyer', 'ananya@spaceschennai.com', 'owner', '+91 94440 98765');
  // User 1: Priya Sharma (Default demo student/user)
  insertUser.run(3, 'Priya Sharma', 'priya@example.com', 'user', '+91 98765 43210');
  // User 2: Rahul Verma
  insertUser.run(4, 'Rahul Verma', 'rahul@example.com', 'user', '+91 97890 12345');

  console.log('Seeding spaces...');
  const insertSpace = db.prepare(`
    INSERT INTO spaces (
      id, owner_id, name, description, category, location,
      price_per_hour, capacity, image_url, available_start, available_end, amenities
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const spaces = [
    {
      id: 1,
      owner_id: 1,
      name: "The Silent Nook - Deep Work & Study Pod",
      description: "A sound-dampened, distraction-free study zone designed for SRM students, researchers, and remote workers preparing for exams or crunching code. Individual desks with dual monitors, ergonomic Herman Miller style chairs, and ultra-fast optical fiber internet.",
      category: "Study Room",
      location: "Potheri, Near SRM University Main Gate, Chennai",
      price_per_hour: 120,
      capacity: 4,
      image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80",
      available_start: "08:00",
      available_end: "22:00",
      amenities: "High-Speed Optical Wi-Fi, Ergonomic Mesh Chairs, AC, Individual Power Outlets, Whiteboard, Filtered Cold/Hot Water, Quiet Zone Policy"
    },
    {
      id: 2,
      owner_id: 1,
      name: "VibeDen SRM Chill & Gaming Lounge",
      description: "The ultimate hangout spot for college friend groups and clubs. Chill on comfortable recliners, play PlayStation 5, stream tournament matches, or unwind between classes in complete privacy.",
      category: "Hangout Space",
      location: "Estancia Townhouse, GST Road, SRM Potheri, Chennai",
      price_per_hour: 280,
      capacity: 8,
      image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
      available_start: "10:00",
      available_end: "23:00",
      amenities: "PlayStation 5 with 4 Controllers, 65-inch 4K OLED TV, Bean Bags, Mini Fridge, JBL PartyBox Bluetooth Speaker, Board Games, Snack Bar"
    },
    {
      id: 3,
      owner_id: 2,
      name: "InnovateHub Boardroom & Presentation Suite",
      description: "A sleek, air-conditioned corporate-ready boardroom. Ideal for student startup pitches, client presentations, club leadership meetings, and collaborative hackathon brainstorms with complete AV support.",
      category: "Meeting Room",
      location: "GST Road, Near Guduvanchery Railway Station, Chennai",
      price_per_hour: 450,
      capacity: 12,
      image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
      available_start: "09:00",
      available_end: "21:00",
      amenities: "4K Laser Projector, 360-degree Conference Mic, Video Calling Rig, Magnetic Glassboard, High-Speed LAN, Nespresso Coffee Machine, Central AC"
    },
    {
      id: 4,
      owner_id: 2,
      name: "Skyline Rooftop Terrace & Open-Air Lounge",
      description: "An open-air rooftop terrace overlooking the scenic Potheri lake. Perfect for evening acoustic jam sessions, project wrap celebrations, club reunions, and twilight barbecues under string lights.",
      category: "Terrace",
      location: "Lakeview Enclave, Potheri, Chennai",
      price_per_hour: 750,
      capacity: 25,
      image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
      available_start: "16:00",
      available_end: "23:00",
      amenities: "Fairy Lights & Wooden Pergola, Barbeque Grill Setup, Acoustic Sound System, Ambient Patio Seating, Sunset Panorama, Restroom Access"
    },
    {
      id: 5,
      owner_id: 1,
      name: "CinePrivé 4K Dolby Atmos Screening Pod",
      description: "Your personal mini-cinema! Host a private movie marathon, watch live Premier League or IPL finals, or showcase indie film cuts with friends in plush leather recliner seating.",
      category: "Private Room",
      location: "SRM Tech Park Peripheral, Maraimalai Nagar, Chennai",
      price_per_hour: 500,
      capacity: 6,
      image_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80",
      available_start: "11:00",
      available_end: "23:00",
      amenities: "120-inch Acoustic Screen, 7.1 Dolby Surround Sound, Plush Reclining Loungers, Netflix/Prime/Hotstar Logged In, Mood Lighting, Microwave"
    },
    {
      id: 6,
      owner_id: 2,
      name: "GrandSphere Workshop & Mini Event Hall",
      description: "A versatile, air-conditioned multi-purpose hall for tech workshops, club inductions, hackathon demos, birthday parties, and cultural rehearsals. Fully equipped with stage and audio-visual equipment.",
      category: "Party/Event Space",
      location: "Kattankulathur Junction, Near SRM Hospital, Chennai",
      price_per_hour: 1200,
      capacity: 50,
      image_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80",
      available_start: "08:00",
      available_end: "22:00",
      amenities: "Raised Stage & Podium, Dual Wireless Mics, Full PA Audio System, Flexible Modular Seating, Green Room, Buffet Prep Area, High-Capacity AC"
    },
    {
      id: 7,
      owner_id: 1,
      name: "Zenith Creator Studio & Podcast Suite",
      description: "A turnkey podcast and content creation studio with acoustic sound-treatment. Plug in your laptop or SD card and start recording crystal-clear audio and 4K video content immediately.",
      category: "Private Room",
      location: "Abode Valley, Potheri, Chennai",
      price_per_hour: 350,
      capacity: 4,
      image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80",
      available_start: "09:00",
      available_end: "21:00",
      amenities: "Shure SM7B Microphones, Rodecaster Pro II Console, Ring Lights & Softboxes, RGB Tube Lights, Soundproofed Booth, Ultra HD Webcams"
    }
  ];

  for (const s of spaces) {
    insertSpace.run(
      s.id,
      s.owner_id,
      s.name,
      s.description,
      s.category,
      s.location,
      s.price_per_hour,
      s.capacity,
      s.image_url,
      s.available_start,
      s.available_end,
      s.amenities
    );
  }

  console.log('Seeding initial bookings...');
  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      id, user_id, space_id, booking_date, start_time, end_time, total_price, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Today and Tomorrow dates in YYYY-MM-DD
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (d) => d.toISOString().split('T')[0];
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  // Pre-seed a booking on Space 1 tomorrow from 10:00 to 13:00 (3 hours @ 120 = 360)
  // This allows immediate testing of double-booking prevention!
  insertBooking.run(1, 3, 1, tomorrowStr, '10:00', '13:00', 360, 'confirmed');

  // Pre-seed a booking on Space 3 tomorrow from 14:00 to 16:00 (2 hours @ 450 = 900)
  insertBooking.run(2, 4, 3, tomorrowStr, '14:00', '16:00', 900, 'confirmed');

  // Pre-seed a booking on Space 4 today from 18:00 to 21:00 (3 hours @ 750 = 2250)
  insertBooking.run(3, 3, 4, todayStr, '18:00', '21:00', 2250, 'confirmed');

  console.log(`Database successfully seeded!`);
  console.log(`- 4 Users (Owners: rajesh@srmspaces.in, ananya@spaceschennai.com | Users: priya@example.com, rahul@example.com)`);
  console.log(`- 7 Realistic Spaces around SRM / Chennai`);
  console.log(`- 3 Sample Bookings (including tomorrow 10:00-13:00 on Space 1 for double booking overlap test)`);
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
