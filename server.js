const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const fetch = require('node-fetch'); // You'll need to install this

// Serve static files from the public directory
app.use(express.static('public'));

// Parse JSON bodies
app.use(express.json());

// Route for the AI analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { content } = req.body;

    // Call the Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `אנא נתח את התשובות הבאות לשאלון הערכה עצמית:\n\n${content}`
        }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ error: 'Failed to get AI analysis' });
  }
});

// Serve the main index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});