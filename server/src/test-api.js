const http = require('http');

const BASE_URL = 'http://localhost:5000';

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting LendMate Comprehensive Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('--- 1. Testing Health API ---');
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'ok', 'Health Check API returns 200 OK');

    // 2. Fetch Spaces
    console.log('\n--- 2. Testing Spaces API ---');
    const allSpaces = await request('/api/spaces');
    assert(allSpaces.status === 200 && Array.isArray(allSpaces.data) && allSpaces.data.length >= 7, 'Fetch all spaces returns at least 7 spaces');

    // Filter by Category
    const studyRooms = await request('/api/spaces?category=Study%20Room');
    assert(studyRooms.status === 200 && studyRooms.data.every(s => s.category === 'Study Room'), 'Filter by category (Study Room) works correctly');

    // Filter by Max Price
    const affordable = await request('/api/spaces?max_price=300');
    assert(affordable.status === 200 && affordable.data.every(s => s.price_per_hour <= 300), 'Filter by max price (<= 300) works correctly');

    // Filter by Location keyword
    const potheri = await request('/api/spaces?search=Potheri');
    assert(potheri.status === 200 && potheri.data.length > 0, 'Search by keyword (Potheri) works correctly');

    // 3. Space Details with booked slots
    console.log('\n--- 3. Testing Space Details & Booked Slots ---');
    const space1 = await request('/api/spaces/1');
    assert(space1.status === 200 && space1.data.name.includes("Silent Nook"), 'Space 1 details retrieved');
    assert(Array.isArray(space1.data.booked_slots), 'Booked slots array included in space details');

    // Calculate tomorrow date string
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // 4. CRITICAL: DOUBLE-BOOKING OVERLAP REJECTION TESTS
    console.log('\n--- 4. CRITICAL REQUIREMENT: Double-Booking Prevention Tests ---');
    console.log(`Pre-seeded booking exists on Space 1 on ${tomorrowStr} from 10:00 to 13:00.`);

    // Case A: Inside overlap (11:00 to 12:00)
    const overlapInside = await request('/api/bookings', { method: 'POST', headers: { 'x-user-id': '3' } }, {
      space_id: 1,
      booking_date: tomorrowStr,
      start_time: '11:00',
      end_time: '12:00'
    });
    assert(
      overlapInside.status === 409 &&
      overlapInside.data.error === 'This space is already booked for the selected time.',
      'Reject overlapping inside booking (11:00-12:00) with status 409 and exact error message'
    );

    // Case B: Start overlap (09:00 to 11:00)
    const overlapStart = await request('/api/bookings', { method: 'POST', headers: { 'x-user-id': '3' } }, {
      space_id: 1,
      booking_date: tomorrowStr,
      start_time: '09:00',
      end_time: '11:00'
    });
    assert(
      overlapStart.status === 409 &&
      overlapStart.data.error === 'This space is already booked for the selected time.',
      'Reject start overlap booking (09:00-11:00) with status 409'
    );

    // Case C: End overlap (12:00 to 14:00)
    const overlapEnd = await request('/api/bookings', { method: 'POST', headers: { 'x-user-id': '3' } }, {
      space_id: 1,
      booking_date: tomorrowStr,
      start_time: '12:00',
      end_time: '14:00'
    });
    assert(
      overlapEnd.status === 409 &&
      overlapEnd.data.error === 'This space is already booked for the selected time.',
      'Reject end overlap booking (12:00-14:00) with status 409'
    );

    // Case D: Engulfing overlap (09:00 to 14:00)
    const overlapEngulf = await request('/api/bookings', { method: 'POST', headers: { 'x-user-id': '3' } }, {
      space_id: 1,
      booking_date: tomorrowStr,
      start_time: '09:00',
      end_time: '14:00'
    });
    assert(
      overlapEngulf.status === 409 &&
      overlapEngulf.data.error === 'This space is already booked for the selected time.',
      'Reject engulfing overlap booking (09:00-14:00) with status 409'
    );

    // Case E: Outside operating hours (07:00 to 09:00, operating is 08:00 - 22:00)
    const outsideHours = await request('/api/bookings', { method: 'POST', headers: { 'x-user-id': '3' } }, {
      space_id: 1,
      booking_date: tomorrowStr,
      start_time: '07:00',
      end_time: '09:00'
    });
    assert(
      outsideHours.status === 400 &&
      outsideHours.data.error.includes('operating hours'),
      'Reject booking outside space operating hours (07:00-09:00)'
    );

    // Case F: VALID NON-OVERLAPPING BOOKING (14:00 to 16:30 = 2.5 hours @ 120 = ₹300)
    console.log('\n--- 5. Testing Valid Booking Creation & Price Calculation ---');
    const validBooking = await request('/api/bookings', { method: 'POST', headers: { 'x-user-id': '3' } }, {
      space_id: 1,
      booking_date: tomorrowStr,
      start_time: '14:00',
      end_time: '16:30'
    });
    assert(
      validBooking.status === 201 &&
      validBooking.data.booking.total_price === 300,
      'Valid booking created with correct price (2.5 hrs * 120 = ₹300)'
    );

    const createdBookingId = validBooking.data?.booking?.id;

    // 6. User Bookings
    console.log('\n--- 6. Testing My Bookings API ---');
    const userBookings = await request('/api/bookings', { headers: { 'x-user-id': '3' } });
    assert(
      userBookings.status === 200 &&
      userBookings.data.some(b => b.id === createdBookingId && b.status === 'confirmed'),
      'Newly created booking appears in user My Bookings list'
    );

    // 7. Owner Flow: Add Space
    console.log('\n--- 7. Testing Owner Flow: Create Space ---');
    const newSpaceRes = await request('/api/spaces', { method: 'POST', headers: { 'x-user-id': '1' } }, {
      name: 'Hackathon Collaboration Suite',
      description: 'Ultra modern war-room for hackathon teams with multiple presentation screens and coffee bar.',
      category: 'Meeting Room',
      location: 'SRM Tech Park 4th Floor, Potheri',
      price_per_hour: 400,
      capacity: 10,
      image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      available_start: '08:00',
      available_end: '22:00',
      amenities: '4K Display, Dual Whiteboards, High Speed Wi-Fi, Coffee Bar'
    });
    assert(newSpaceRes.status === 201 && newSpaceRes.data.space.name === 'Hackathon Collaboration Suite', 'Owner creates new space successfully');

    // 8. Owner Dashboard API
    console.log('\n--- 8. Testing Owner Dashboard API ---');
    const ownerSpaces = await request('/api/owner/spaces', { headers: { 'x-user-id': '1' } });
    assert(ownerSpaces.status === 200 && ownerSpaces.data.length >= 4, 'Owner spaces list includes new and existing spaces');

    const ownerBookings = await request('/api/owner/bookings', { headers: { 'x-user-id': '1' } });
    assert(
      ownerBookings.status === 200 &&
      ownerBookings.data.stats &&
      ownerBookings.data.bookings.length > 0,
      'Owner bookings API returns reservation stats and customer details'
    );

    // 9. Cancel Booking & Slot Re-availability
    console.log('\n--- 9. Testing Booking Cancellation ---');
    const cancelRes = await request(`/api/bookings/${createdBookingId}`, { method: 'DELETE', headers: { 'x-user-id': '3' } });
    assert(cancelRes.status === 200, 'Booking cancelled successfully');

    // Now the 14:00 to 16:30 slot on Space 1 MUST BE FREE AGAIN!
    const rebook = await request('/api/bookings', { method: 'POST', headers: { 'x-user-id': '4' } }, {
      space_id: 1,
      booking_date: tomorrowStr,
      start_time: '14:00',
      end_time: '16:00'
    });
    assert(rebook.status === 201, 'Cancelled slot is immediately free and can be booked again by another user');

    console.log('\n===============================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

// Wait briefly for server or run tests
runTests();
