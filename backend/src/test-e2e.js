const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runE2ETests() {
  console.log('=== [DarkGuard E2E Test Suite Running] ===');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`• ${name}... `);
      await fn();
      console.log('✅ PASS');
      passed++;
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
      if (err.response) {
        console.log('  Response:', err.response.status, err.response.data);
      }
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health responds with status online', async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.data.status !== 'online') throw new Error('Expected status online');
  });

  // 2. Statistics endpoint
  await test('GET /api/statistics returns platform metrics and charts', async () => {
    const res = await axios.get(`${BASE_URL}/statistics`);
    if (!res.data.success || !res.data.stats || !res.data.charts) {
      throw new Error('Malformed statistics response');
    }
    if (res.data.stats.totalReports < 1) throw new Error('Expected at least 1 seeded report');
  });

  // 3. Public reports feed
  let sampleReportId = null;
  await test('GET /api/reports returns paginated reports', async () => {
    const res = await axios.get(`${BASE_URL}/reports?limit=5`);
    if (!res.data.success || !Array.isArray(res.data.reports)) {
      throw new Error('Invalid reports feed');
    }
    sampleReportId = res.data.reports[0]._id;
  });

  // 4. Single report details
  await test('GET /api/reports/:id retrieves single report details', async () => {
    const res = await axios.get(`${BASE_URL}/reports/${sampleReportId}`);
    if (!res.data.success || !res.data.report) {
      throw new Error('Report details retrieval failed');
    }
  });

  // 5. Search reports
  await test('GET /api/reports/search matches query', async () => {
    const res = await axios.get(`${BASE_URL}/reports/search?q=checkout`);
    if (!res.data.success || !Array.isArray(res.data.reports)) {
      throw new Error('Search failed');
    }
  });

  // 6. Leaderboard
  await test('GET /api/leaderboard returns ranked community advocates', async () => {
    const res = await axios.get(`${BASE_URL}/leaderboard`);
    if (!res.data.success || res.data.leaderboard.length < 1) {
      throw new Error('Leaderboard empty');
    }
    if (!res.data.leaderboard[0].reputation) {
      throw new Error('Missing reputation in leaderboard rank 1');
    }
  });

  // 7. Dark pattern analysis
  await test('POST /api/analyze inspects suspicious URL', async () => {
    const res = await axios.post(`${BASE_URL}/analyze`, {
      url: 'https://travel-airline.test/checkout/final-step'
    });
    if (!res.data.success || typeof res.data.riskScore !== 'number') {
      throw new Error('Analysis response missing riskScore');
    }
    if (!Array.isArray(res.data.patterns) || res.data.patterns.length === 0) {
      throw new Error('Expected detected dark patterns');
    }
  });

  // 8. Auth: Login with seeded Admin
  let adminToken = null;
  await test('POST /api/auth/login validates admin credentials', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@darkguard.test',
      password: 'Admin@12345'
    });
    if (!res.data.success || !res.data.token) {
      throw new Error('Admin login failed');
    }
    adminToken = res.data.token;
  });

  // 9. Auth: Me profile
  await test('GET /api/auth/me returns authenticated admin profile', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || res.data.user.role !== 'admin') {
      throw new Error('Admin profile validation failed');
    }
  });

  // 10. Register new test user & vote
  let testUserToken = null;
  const uniqueEmail = `testuser_${Date.now()}@darkguard.test`;
  await test('POST /api/auth/register creates new consumer account', async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Sentinel',
      email: uniqueEmail,
      password: 'TestPassword123'
    });
    if (!res.data.success || !res.data.token) {
      throw new Error('User registration failed');
    }
    testUserToken = res.data.token;
  });

  // 11. Voting with anti-abuse toggle
  await test('POST /api/reports/:id/vote toggles user vote', async () => {
    // Vote experienced
    const res1 = await axios.post(
      `${BASE_URL}/reports/${sampleReportId}/vote`,
      { voteType: 'experienced' },
      { headers: { Authorization: `Bearer ${testUserToken}` } }
    );
    if (!res1.data.success || res1.data.userVote !== 'experienced') {
      throw new Error('Vote creation failed');
    }

    // Toggle off (clicking again removes vote)
    const res2 = await axios.post(
      `${BASE_URL}/reports/${sampleReportId}/vote`,
      { voteType: 'experienced' },
      { headers: { Authorization: `Bearer ${testUserToken}` } }
    );
    if (!res2.data.success || res2.data.userVote !== null) {
      throw new Error('Vote toggle off failed');
    }
  });

  // 12. Add comment
  await test('POST /api/reports/:id/comments posts community comment', async () => {
    const res = await axios.post(
      `${BASE_URL}/reports/${sampleReportId}/comments`,
      { comment: 'E2E automated test: I confirmed this deceptive design on Safari.' },
      { headers: { Authorization: `Bearer ${testUserToken}` } }
    );
    if (!res.data.success || !res.data.comment) {
      throw new Error('Comment creation failed');
    }
  });

  // 13. Submit new report
  let createdReportId = null;
  await test('POST /api/reports creates new community dark pattern report', async () => {
    const res = await axios.post(
      `${BASE_URL}/reports`,
      {
        websiteUrl: 'https://e2e-subscription-trap.test/signup',
        category: 'Subscription Trap',
        description: 'Auto-renewal terms were concealed in muted 8px font beneath the confirm button.',
        confirmationAccepted: 'true',
        initialPrice: '0.00',
        finalPrice: '39.99',
        subscriptionAmount: '39.99'
      },
      { headers: { Authorization: `Bearer ${testUserToken}` } }
    );
    if (!res.data.success || !res.data.reportId) {
      throw new Error('Report submission failed');
    }
    createdReportId = res.data.reportId;
  });

  // 14. Admin verify report
  await test('PUT /api/admin/reports/:id/verify verifies report as Admin', async () => {
    const res = await axios.put(
      `${BASE_URL}/admin/reports/${createdReportId}/verify`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (!res.data.success || res.data.report.status !== 'Verified') {
      throw new Error('Admin verification failed');
    }
    if (res.data.report.verificationBadge !== 'Admin Verified') {
      throw new Error('Admin verification badge not set');
    }
  });

  console.log('\n======================================');
  console.log(`E2E TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('======================================');
  if (failed > 0) process.exit(1);
  process.exit(0);
}

runE2ETests().catch((err) => {
  console.error('Fatal E2E error:', err);
  process.exit(1);
});
