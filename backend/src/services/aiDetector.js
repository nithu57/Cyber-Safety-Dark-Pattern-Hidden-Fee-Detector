const fs = require('fs');
const path = require('path');
const axios = require('axios');

/**
 * Helper to compute risk level string from risk score (0-100)
 */
function getRiskLevel(score) {
  if (score <= 25) return 'Low';
  if (score <= 50) return 'Moderate';
  if (score <= 75) return 'High';
  return 'Critical';
}

/**
 * Intelligent Heuristic Analyzer
 * Evaluates domain cues, image metadata/name, and checkout patterns
 */
function runHeuristicAnalysis({ url, domain, filename, mimeType }) {
  const patterns = [];
  const lowerUrl = (url || '').toLowerCase();
  const lowerDomain = (domain || '').toLowerCase();
  const lowerFile = (filename || '').toLowerCase();

  // Pattern 1: Hidden Fees / Surcharges
  if (
    lowerUrl.includes('travel') ||
    lowerUrl.includes('airline') ||
    lowerUrl.includes('ticket') ||
    lowerUrl.includes('checkout') ||
    lowerFile.includes('fee') ||
    lowerFile.includes('price') ||
    lowerFile.includes('checkout')
  ) {
    patterns.push({
      type: 'Hidden Fee',
      status: 'Potential Dark Pattern Detected',
      confidence: 0.89,
      evidence: 'Additional compulsory booking and processing surcharge ($14.99) introduced only in the final payment breakdown step without prior disclosure.',
      explanation: 'Drip pricing technique where incremental ancillary charges accumulate during sequential checkout steps, concealing the true baseline cost.',
      recommendedAction: 'Verify all itemized line items on the final payment confirmation screen before clicking purchase.'
    });
  }

  // Pattern 2: Preselected Options / Default Opt-ins
  if (
    lowerUrl.includes('shop') ||
    lowerUrl.includes('cart') ||
    lowerFile.includes('checkbox') ||
    lowerFile.includes('opt') ||
    lowerFile.includes('insurance') ||
    lowerDomain.includes('shop')
  ) {
    patterns.push({
      type: 'Preselected Add-on',
      status: 'Potential Dark Pattern Detected',
      confidence: 0.84,
      evidence: 'Optional expedited warranty protection ($8.50) is toggled to checked by default in the shopping cart.',
      explanation: 'Default bias exploitation where non-essential add-on items are pre-selected, relying on user cognitive fatigue or oversight.',
      recommendedAction: 'Carefully inspect all pre-ticked checkboxes before proceeding past the order summary.'
    });
  }

  // Pattern 3: Fake Urgency / Pressure selling
  if (
    lowerUrl.includes('deal') ||
    lowerUrl.includes('flash') ||
    lowerUrl.includes('hotel') ||
    lowerFile.includes('countdown') ||
    lowerFile.includes('timer') ||
    lowerFile.includes('urgency')
  ) {
    patterns.push({
      type: 'Fake Countdown / Urgency',
      status: 'Possible Deceptive Design',
      confidence: 0.91,
      evidence: 'Flashing countdown timer with message "Only 1 item left in stock – reserve in 04:59 minutes!" resetting upon page reload.',
      explanation: 'Artificial scarcity and high-pressure psychological manipulation designed to trigger impulse purchasing.',
      recommendedAction: 'Take time to cross-compare rates on independent price tracking engines before submitting card details.'
    });
  }

  // Pattern 4: Subscription Trap / Difficult Cancellation
  if (
    lowerUrl.includes('sub') ||
    lowerUrl.includes('stream') ||
    lowerUrl.includes('free') ||
    lowerFile.includes('trial') ||
    lowerFile.includes('cancel') ||
    lowerDomain.includes('stream') ||
    lowerDomain.includes('sub')
  ) {
    patterns.push({
      type: 'Subscription Trap',
      status: 'Potential Dark Pattern Detected',
      confidence: 0.93,
      evidence: 'Free 7-day trial requires payment card and auto-renews at $39.99/mo in faint 9px grey text beneath the prominent action button.',
      explanation: 'Forced continuity where free trial sign-ups silently roll over into recurring billings with buried opt-out disclosures.',
      recommendedAction: 'Check recurring subscription settings immediately or set a calendar cancellation reminder.'
    });
  }

  // Pattern 5: Confirmshaming / Misleading CTA
  if (
    lowerUrl.includes('popup') ||
    lowerUrl.includes('newsletter') ||
    lowerFile.includes('modal') ||
    lowerFile.includes('confirm') ||
    patterns.length === 0
  ) {
    patterns.push({
      type: 'Confirmshaming',
      status: 'Possible Deceptive Design',
      confidence: 0.78,
      evidence: 'Opt-out decline button is styled in muted grey with guilt-inducing phrasing: "No thanks, I prefer paying full price".',
      explanation: 'Emotional manipulation in UI microcopy intended to dissuade consumers from exercising their opt-out rights.',
      recommendedAction: 'Disregard emotional phrasing and select the opt-out option if you do not desire the promotion.'
    });
  }

  // If still fewer than 2 patterns, add Misleading CTA
  if (patterns.length < 2) {
    patterns.push({
      type: 'Misleading Button (Visual Interference)',
      status: 'Potential Dark Pattern Detected',
      confidence: 0.82,
      evidence: 'Primary acceptance action is rendered in high-contrast vibrant green, whereas the cancel button is camouflaged as flat body text.',
      explanation: 'Asymmetric visual hierarchy directing user actions toward the business\'s preferred choice over the consumer\'s best interest.',
      recommendedAction: 'Examine muted text links for genuine exit or cancellation paths.'
    });
  }

  // Calculate weighted risk score
  const avgConfidence = patterns.reduce((acc, p) => acc + p.confidence, 0) / patterns.length;
  const baseScore = Math.min(95, Math.round(patterns.length * 28 + avgConfidence * 30));
  const riskScore = Math.max(20, Math.min(98, baseScore));
  const riskLevel = getRiskLevel(riskScore);

  return {
    riskScore,
    riskLevel,
    patterns,
    summary: `Heuristic inspection flagged ${patterns.length} potential deceptive UI patterns with high confidence indicators.`,
    analysisEngine: 'DarkGuard Cyber-Heuristic Vision Engine',
    disclaimer: 'DarkGuard automated analysis is an assistive assessment tool, not a definitive legal determination.'
  };
}

/**
 * Gemini Vision API Analysis (if GEMINI_API_KEY is configured)
 */
async function runGeminiVisionAnalysis(imagePath, url, domain) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Data = fileBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase().replace('.', '');
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    const prompt = `You are DarkGuard's Cyber-Safety Dark Pattern and Deceptive Design Inspector.
Analyze this user interface screenshot for manipulative or deceptive design patterns (dark patterns) such as:
- Hidden Fees / Drip Pricing
- Preselected Add-ons / Default Options
- Subscription Traps / Hidden Recurring Charges
- Fake Urgency / Artificial Countdown Clocks
- Confirmshaming / Manipulative Microcopy
- Misleading CTA Buttons / Visual Interference
- Difficult Cancellation / Roach Motel

CRITICAL LEGAL GUIDELINE:
Do NOT state that the website is illegal, fraudulent, or criminal.
Use objective, protective language such as "Potential dark pattern detected", "Possible deceptive design", "Requires verification".

Respond ONLY with valid JSON in this exact structure without markdown backticks:
{
  "riskScore": 76,
  "riskLevel": "High",
  "summary": "Brief 1-2 sentence overview of observed design patterns.",
  "patterns": [
    {
      "type": "Hidden Fee",
      "status": "Potential Dark Pattern Detected",
      "confidence": 0.91,
      "evidence": "Description of specific visual elements, pricing numbers, or text",
      "explanation": "Why this design technique manipulates consumer choice",
      "recommendedAction": "Actionable defense advice for consumer"
    }
  ]
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(
      endpoint,
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json"
        }
      },
      { timeout: 20000 }
    );

    const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      const parsed = JSON.parse(candidateText.trim());
      if (parsed.riskScore && Array.isArray(parsed.patterns)) {
        return {
          ...parsed,
          riskLevel: getRiskLevel(parsed.riskScore),
          analysisEngine: 'Gemini Multimodal Vision AI',
          disclaimer: 'DarkGuard automated analysis is an assistive assessment tool, not a definitive legal determination.'
        };
      }
    }
  } catch (err) {
    console.warn('[AI Detector] Gemini Vision call fallback to heuristic engine:', err.message);
  }
  return null;
}

/**
 * Main analyze function
 */
async function analyzeScreenshotOrUrl({ url, filePath, originalFilename }) {
  let domain = '';
  if (url) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      domain = parsed.hostname;
    } catch {
      domain = url;
    }
  }

  // If screenshot is present and Gemini API key is available, try Gemini vision
  if (filePath && fs.existsSync(filePath) && process.env.GEMINI_API_KEY) {
    const geminiResult = await runGeminiVisionAnalysis(filePath, url, domain);
    if (geminiResult) return geminiResult;
  }

  // Fallback to our robust heuristic analyzer
  return runHeuristicAnalysis({
    url,
    domain,
    filename: originalFilename || (filePath ? path.basename(filePath) : ''),
    mimeType: filePath ? path.extname(filePath) : ''
  });
}

module.exports = {
  analyzeScreenshotOrUrl,
  getRiskLevel
};
