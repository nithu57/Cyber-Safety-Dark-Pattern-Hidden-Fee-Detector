const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Report = require('../models/Report');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');
const AnalysisResult = require('../models/AnalysisResult');

// Helper to write mock SVG screenshot placeholders for demo reports
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function createMockSvgScreenshot(filename, title, subtitle, patternType, highlightText) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="alertGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  
  <!-- Browser Window Mockup -->
  <rect width="800" height="500" rx="12" fill="url(#bg)" stroke="#334155" stroke-width="2"/>
  
  <!-- Browser Chrome / Title Bar -->
  <rect width="800" height="42" rx="12" fill="#0f172a" />
  <circle cx="25" cy="21" r="6" fill="#ef4444" />
  <circle cx="45" cy="21" r="6" fill="#f59e0b" />
  <circle cx="65" cy="21" r="6" fill="#10b981" />
  <rect x="110" y="10" width="580" height="22" rx="6" fill="#1e293b" />
  <text x="130" y="25" fill="#94a3b8" font-family="sans-serif" font-size="12">https://${subtitle}</text>

  <!-- Page Content -->
  <rect x="40" y="70" width="720" height="70" rx="8" fill="#1e293b" opacity="0.6"/>
  <text x="65" y="105" fill="#f8fafc" font-family="sans-serif" font-size="20" font-weight="bold">${title}</text>
  <text x="65" y="128" fill="#94a3b8" font-family="sans-serif" font-size="13">Category: ${patternType} | Flagged by DarkGuard</text>

  <!-- Highlight Box (Simulating Deceptive UI Element) -->
  <rect x="60" y="170" width="680" height="200" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,6"/>
  <rect x="60" y="170" width="220" height="30" rx="6" fill="url(#alertGrad)"/>
  <text x="75" y="191" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">⚠ DECEPTIVE UI EVIDENCE</text>

  <!-- Highlight Mockup Details -->
  <text x="90" y="240" fill="#f1f5f9" font-family="monospace" font-size="15">${highlightText}</text>
  <rect x="90" y="270" width="260" height="42" rx="6" fill="#2563eb"/>
  <text x="130" y="296" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Accept &amp; Continue</text>
  
  <rect x="370" y="270" width="310" height="42" rx="6" fill="#1e293b" stroke="#475569"/>
  <text x="390" y="295" fill="#64748b" font-family="sans-serif" font-size="12">No thanks, I prefer paying extra fees</text>

  <!-- DarkGuard Watermark -->
  <rect x="40" y="410" width="720" height="50" rx="8" fill="#131b2e" />
  <text x="65" y="440" fill="#06b6d4" font-family="sans-serif" font-size="13" font-weight="bold">🛡 DarkGuard Verified Cyber-Safety Evidence Sample</text>
  <text x="620" y="440" fill="#64748b" font-family="sans-serif" font-size="12">Fictional Demo Entity</text>
</svg>`;

  const fullPath = path.join(uploadDir, filename);
  fs.writeFileSync(fullPath, svgContent);
  return `/uploads/${filename}`;
}

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/darkguard';
    await mongoose.connect(mongoUri);
    console.log('[DarkGuard Seeder] Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Report.deleteMany({});
    await Vote.deleteMany({});
    await Comment.deleteMany({});
    await AnalysisResult.deleteMany({});
    console.log('[DarkGuard Seeder] Cleaned existing collections.');

    // Passwords
    const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);
    const userPasswordHash = await bcrypt.hash('User@12345', 10);

    // Create Demo Users
    const adminUser = await User.create({
      name: 'DarkGuard Admin',
      email: 'admin@darkguard.test',
      passwordHash: adminPasswordHash,
      role: 'admin',
      reputation: 999,
      badges: ['Verified Contributor', 'Community Guardian', 'Top Hunter', 'Dark Pattern Analyst']
    });

    const user1 = await User.create({
      name: 'CyberHunter',
      email: 'cyberhunter@darkguard.test',
      passwordHash: userPasswordHash,
      role: 'user',
      reputation: 245,
      badges: ['First Report', 'Evidence Expert', 'Top Hunter', 'Verified Contributor']
    });

    const user2 = await User.create({
      name: 'SafeWeb',
      email: 'safeweb@darkguard.test',
      passwordHash: userPasswordHash,
      role: 'user',
      reputation: 198,
      badges: ['First Report', 'Verified Contributor', 'Community Guardian']
    });

    const user3 = await User.create({
      name: 'PrivacyGuard',
      email: 'privacyguard@darkguard.test',
      passwordHash: userPasswordHash,
      role: 'user',
      reputation: 176,
      badges: ['Community Guardian', 'Evidence Expert']
    });

    const user4 = await User.create({
      name: 'AlexScout',
      email: 'alex_scout@darkguard.test',
      passwordHash: userPasswordHash,
      role: 'user',
      reputation: 112,
      badges: ['First Report', 'Evidence Expert']
    });

    console.log('[DarkGuard Seeder] Demo users created.');

    // Generate evidence screenshots
    const img1 = createMockSvgScreenshot(
      'evidence-travel.svg',
      'Flight Checkout Final Step',
      'travel-checkout.test/book/step4',
      'Hidden Fee',
      '+$18.50 Mandatory "Processing &amp; Luggage Handling Fee" injected'
    );
    const img2 = createMockSvgScreenshot(
      'evidence-stream.svg',
      'StreamPlus Trial Subscription',
      'stream-plus.test/activate-free-trial',
      'Subscription Trap',
      'Auto-renews at $44.99/mo (disclosed only in tiny 8px footer)'
    );
    const img3 = createMockSvgScreenshot(
      'evidence-shop.svg',
      'Cart Checkout Add-ons',
      'shop-example.test/cart/review',
      'Pre-checked Option',
      'Pre-selected [✓] $12.99 Platinum Package Protection'
    );
    const img4 = createMockSvgScreenshot(
      'evidence-deal.svg',
      'Exit-Intent Discount Modal',
      'deal-hub.test/checkout',
      'Confirmshaming',
      '"No thanks, I hate saving money &amp; like paying full retail"'
    );
    const img5 = createMockSvgScreenshot(
      'evidence-urgency.svg',
      'Flash Promo Countdown',
      'flash-deals.test/product/cyber-gadget',
      'Fake Urgency',
      'Perpetual counter "Only 2 minutes left!" resets on reload'
    );
    const img6 = createMockSvgScreenshot(
      'evidence-gym.svg',
      'Membership Account Settings',
      'gym-pass.test/account/membership',
      'Difficult Cancellation',
      'Sign-up was 1-click; Cancellation requires physical certified mail'
    );
    const img7 = createMockSvgScreenshot(
      'evidence-cloud.svg',
      'Hosting Tier Pricing Plan',
      'cloud-hosting.test/vps/plans',
      'Bait & Switch',
      'Stated $1.99/mo locks you into $240 3-year non-refundable lump sum'
    );
    const img8 = createMockSvgScreenshot(
      'evidence-privacy.svg',
      'GDPR Cookie Consent Barrier',
      'privacy-tracker.test/consent',
      'Privacy Dark Pattern',
      'Big Green "Accept All Tracking", Reject All requires visiting 18 tabs'
    );

    // Create 8+ Detailed Realistic Demo Reports
    const reportsData = [
      {
        userId: user1._id,
        websiteUrl: 'https://travel-checkout.test/book/flight-671',
        domain: 'travel-checkout.test',
        category: 'Hidden Fee',
        description: 'During checkout for a flight listed at $149, three undisclosed sequential surcharges appeared on the final step right before the credit card submission: a $12.50 regulatory facility fee, a $6.00 payment processing surcharge, and a mandatory $15 baggage intake fee.',
        screenshotUrl: img1,
        riskScore: 88,
        status: 'Verified',
        verificationBadge: 'Admin Verified',
        isDemo: true,
        evidence: {
          initialPrice: 149.00,
          finalPrice: 182.50,
          additionalFee: 33.50,
          subscriptionAmount: null,
          cancellationDifficulty: 'Moderate'
        },
        detectedPatterns: [
          {
            type: 'Hidden Fee',
            confidence: 0.94,
            evidence: 'Mandatory processing and intake surcharges totalling $33.50 appeared exclusively on step 4.',
            explanation: 'Drip pricing masks true baseline cost until the buyer is psychologically invested.'
          }
        ],
        votesCount: { experienced: 142, disagree: 3 },
        commentsCount: 3
      },
      {
        userId: user2._id,
        websiteUrl: 'https://stream-plus.test/signup/trial',
        domain: 'stream-plus.test',
        category: 'Subscription Trap',
        description: 'Advertises "Watch Free for 7 Days". Entering card credentials automatically subscribes you to an annual recurring tier of $44.99/mo billed as an upfront charge after day 7 with no reminder email provided.',
        screenshotUrl: img2,
        riskScore: 94,
        status: 'Verified',
        verificationBadge: 'Admin Verified',
        isDemo: true,
        evidence: {
          initialPrice: 0.00,
          finalPrice: 44.99,
          additionalFee: null,
          subscriptionAmount: 44.99,
          cancellationDifficulty: 'Near Impossible'
        },
        detectedPatterns: [
          {
            type: 'Subscription Trap',
            confidence: 0.96,
            evidence: 'Small muted 8px disclaimer rolls trial into recurring monthly charge without opt-out checkbox.',
            explanation: 'Forced continuity obscures billing recurrence behind free trial promotional copy.'
          }
        ],
        votesCount: { experienced: 98, disagree: 2 },
        commentsCount: 2
      },
      {
        userId: user3._id,
        websiteUrl: 'https://shop-example.test/cart/express-checkout',
        domain: 'shop-example.test',
        category: 'Pre-checked Option',
        description: 'When buying an electronics accessory, the cart automatically pre-selects an optional $12.99 "Priority Damage Protection Plan". The checkbox is styled to blend into the order summary background.',
        screenshotUrl: img3,
        riskScore: 72,
        status: 'Under Review',
        verificationBadge: 'Community Reported',
        isDemo: true,
        evidence: {
          initialPrice: 45.00,
          finalPrice: 57.99,
          additionalFee: 12.99,
          subscriptionAmount: null,
          cancellationDifficulty: 'Easy'
        },
        detectedPatterns: [
          {
            type: 'Preselected Add-on',
            confidence: 0.88,
            evidence: 'Protection plan checkbox pre-populated in checked state.',
            explanation: 'Relies on user inattention during fast checkout to sell ancillary insurance.'
          }
        ],
        votesCount: { experienced: 64, disagree: 4 },
        commentsCount: 1
      },
      {
        userId: user1._id,
        websiteUrl: 'https://deal-hub.test/promotions/clearance',
        domain: 'deal-hub.test',
        category: 'Confirmshaming',
        description: 'When attempting to close a discount popup or proceed to checkout, the dismiss link reads: "No thanks, I hate saving money and prefer overpaying". High pressure guilt-trip copy.',
        screenshotUrl: img4,
        riskScore: 58,
        status: 'Under Review',
        verificationBadge: 'Community Reported',
        isDemo: true,
        evidence: {
          initialPrice: null,
          finalPrice: null,
          additionalFee: null,
          subscriptionAmount: null,
          cancellationDifficulty: null
        },
        detectedPatterns: [
          {
            type: 'Confirmshaming',
            confidence: 0.85,
            evidence: 'Guilt-inducing button microcopy to discourage declining.',
            explanation: 'Emotional coercion in UI microcopy aimed at shaming consumers.'
          }
        ],
        votesCount: { experienced: 47, disagree: 1 },
        commentsCount: 1
      },
      {
        userId: null,
        websiteUrl: 'https://flash-deals.test/product/cyber-gadget',
        domain: 'flash-deals.test',
        category: 'Fake Urgency',
        description: 'Automated DarkGuard crawler detected a timer banner claiming "Only 2 minutes left to claim 70% off!". Inspection revealed the timer resets to 02:00 every time the webpage is refreshed or re-entered.',
        screenshotUrl: img5,
        riskScore: 82,
        status: 'Pending',
        verificationBadge: 'AI Detected',
        isDemo: true,
        evidence: {
          initialPrice: 99.00,
          finalPrice: 29.00,
          additionalFee: null,
          subscriptionAmount: null,
          cancellationDifficulty: 'Easy'
        },
        detectedPatterns: [
          {
            type: 'Fake Urgency / Countdown',
            confidence: 0.92,
            evidence: 'Client-side script resets countdown clock timer on page load event.',
            explanation: 'Fabricated scarcity creating synthetic psychological urgency.'
          }
        ],
        votesCount: { experienced: 38, disagree: 2 },
        commentsCount: 0
      },
      {
        userId: user4._id,
        websiteUrl: 'https://gym-pass.test/membership',
        domain: 'gym-pass.test',
        category: 'Difficult Cancellation',
        description: 'Enrolling took 30 seconds online with Apple Pay. When trying to cancel membership, the portal states cancellation is only processed if an in-person appointment is scheduled or a certified letter is mailed 45 days in advance.',
        screenshotUrl: img6,
        riskScore: 91,
        status: 'Verified',
        verificationBadge: 'Admin Verified',
        isDemo: true,
        evidence: {
          initialPrice: 29.99,
          finalPrice: 29.99,
          additionalFee: 49.00,
          subscriptionAmount: 29.99,
          cancellationDifficulty: 'Near Impossible'
        },
        detectedPatterns: [
          {
            type: 'Difficult Cancellation (Roach Motel)',
            confidence: 0.95,
            evidence: 'Severe asymmetry between easy digital signup vs onerous offline cancellation protocol.',
            explanation: 'Erects extreme friction barriers to keep subscribers paying fees against their will.'
          }
        ],
        votesCount: { experienced: 119, disagree: 1 },
        commentsCount: 2
      },
      {
        userId: user2._id,
        websiteUrl: 'https://cloud-hosting.test/servers',
        domain: 'cloud-hosting.test',
        category: 'Bait & Switch',
        description: 'Bold promotional banner offers "$1.99/mo VPS hosting". Upon checkout, the $1.99 rate only applies if you commit to an unrefundable 36-month lump sum upfront payment of $238.80.',
        screenshotUrl: img7,
        riskScore: 79,
        status: 'Verified',
        verificationBadge: 'Admin Verified',
        isDemo: true,
        evidence: {
          initialPrice: 1.99,
          finalPrice: 238.80,
          additionalFee: null,
          subscriptionAmount: null,
          cancellationDifficulty: 'Hard'
        },
        detectedPatterns: [
          {
            type: 'Bait & Switch Pricing',
            confidence: 0.87,
            evidence: 'Headline price of $1.99 is conditioned on multi-year contract hidden until checkout.',
            explanation: 'Entices users with illusory low monthly cost, demanding massive upfront commitment.'
          }
        ],
        votesCount: { experienced: 73, disagree: 5 },
        commentsCount: 1
      },
      {
        userId: user3._id,
        websiteUrl: 'https://privacy-tracker.test/portal',
        domain: 'privacy-tracker.test',
        category: 'Privacy Dark Pattern',
        description: 'Consent modal features a massive cyan "Accept All 140+ Ad Trackers" button. The alternative "Reject All" option does not exist; users are forced to toggle 18 individual accordions manually.',
        screenshotUrl: img8,
        riskScore: 86,
        status: 'Verified',
        verificationBadge: 'Admin Verified',
        isDemo: true,
        evidence: {
          initialPrice: null,
          finalPrice: null,
          additionalFee: null,
          subscriptionAmount: null,
          cancellationDifficulty: 'Hard'
        },
        detectedPatterns: [
          {
            type: 'Privacy Dark Pattern',
            confidence: 0.91,
            evidence: 'Asymmetrical cookie consent banner with missing bulk reject button.',
            explanation: 'Privacy fatigue manipulation steering users into surrendering data rights.'
          }
        ],
        votesCount: { experienced: 85, disagree: 2 },
        commentsCount: 2
      }
    ];

    const createdReports = await Report.insertMany(reportsData);
    console.log(`[DarkGuard Seeder] ${createdReports.length} demo reports created.`);

    // Seed realistic comments
    await Comment.create([
      {
        userId: user2._id,
        reportId: createdReports[0]._id,
        comment: 'I experienced this exact hidden fee last month when booking tickets! It added over $30 right before authorization.'
      },
      {
        userId: user3._id,
        reportId: createdReports[0]._id,
        comment: 'Great catch. The civil aviation authority recently released consumer guidance against this exact drip pricing tactic.'
      },
      {
        userId: user1._id,
        reportId: createdReports[1]._id,
        comment: 'Be careful! Their cancellation link just redirects you to a chatbot that keeps offering 10% discounts instead of canceling.'
      },
      {
        userId: user4._id,
        reportId: createdReports[5]._id,
        comment: 'Can confirm. I had to send an actual physical certified letter to cancel my subscription. Ridiculous friction.'
      }
    ]);

    // Seed votes
    await Vote.create([
      { userId: user1._id, reportId: createdReports[0]._id, voteType: 'experienced' },
      { userId: user2._id, reportId: createdReports[0]._id, voteType: 'experienced' },
      { userId: user3._id, reportId: createdReports[0]._id, voteType: 'experienced' },
      { userId: user4._id, reportId: createdReports[0]._id, voteType: 'experienced' },
      { userId: user1._id, reportId: createdReports[1]._id, voteType: 'experienced' },
      { userId: user2._id, reportId: createdReports[1]._id, voteType: 'experienced' }
    ]);

    console.log('[DarkGuard Seeder] Seed data successfully populated!');
    process.exit(0);
  } catch (err) {
    console.error('[DarkGuard Seeder] Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
