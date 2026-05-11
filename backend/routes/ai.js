const express = require('express');
const router = express.Router();
const axios = require('axios');

// Analyze image and return style keywords and description
router.post('/analyze-image', async (req, res) => {
  try {
    const { image, imageType } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image data is required' });
    }

    // Use Claude API for image analysis
    const response = await analyzeImageWithClaude(image);

    res.json({
      analysis: response.analysis,
      keywords: response.keywords,
      fabric: response.fabric,
      item: response.item,
      success: true
    });
  } catch (error) {
    console.error('Error analyzing image:', error);

    res.status(500).json({
      message: 'Image analysis failed',
      analysis: 'Unable to analyze the image at this time.',
      keywords: [],
      pieces: []
    });
  }
});

// Analyze image using Claude's vision capabilities
async function analyzeImageWithClaude(base64Image) {
  try {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return getFallbackAnalysis();
    }

    console.log('Calling Claude API with vision...');

    // Call Claude with vision capabilities
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: `Analyze this fashion item image and identify:

1. What is the main clothing item? (jacket, shirt, dress, pants, etc.)
2. What fabric is it made of? (denim, cotton, silk, wool, linen, polyester, knit, leather, satin, velvet, fleece, etc.)
3. What color is it?
4. Brief style description (casual, formal, vintage, modern, sporty, etc.)
5. Extract 5-7 keywords

Format your response as JSON:
{
  "analysis": "This is a [fabric] [item] in [color]. [2-3 sentence description of style and use]",
  "fabric": "fabric name",
  "item": "clothing item name",
  "keywords": ["keyword1", "keyword2", "keyword3", ...]
}

Only respond with valid JSON, no additional text.`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    // Extract the response
    const content = response.data.content[0].text;
    console.log('Claude response:', content);

    const parsed = JSON.parse(content);

    return {
      analysis: parsed.analysis || 'Fashion image analyzed',
      keywords: parsed.keywords || [],
      pieces: parsed.pieces || []
    };
  } catch (error) {
    console.error('Claude API error:', error.response?.data || error.message);

    if (error.response?.status === 429) {
      console.error('Rate limited - too many requests');
    }
    if (error.response?.status === 401) {
      console.error('Authentication failed - check API key');
    }

    return getFallbackAnalysis();
  }
}

// Fallback analysis if API fails
function getFallbackAnalysis() {
  return {
    analysis: 'Image analysis unavailable. Try uploading a clearer fashion image.',
    keywords: ['clothing', 'fashion', 'style', 'outfit'],
    pieces: []
  };
}

module.exports = router;
