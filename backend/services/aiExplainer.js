const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function explainFraud({ amount, riskScore, reasons, receiverName }) {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 150,
      messages: [
        {
          role: 'system',
          content: 'You are a banking fraud analyst. Write clear, calm, 2-sentence explanations for flagged transactions. Speak directly to the customer. Never use bullet points or headers.'
        },
        {
          role: 'user',
          content: `Explain why this transaction was flagged:
- Amount: ₹${Number(amount).toLocaleString('en-IN')}
- Risk score: ${Math.round(riskScore * 100)}%
- Recipient account: ${receiverName || 'Unknown'}
- Risk factors: ${reasons.join(', ')}

Write exactly 2 sentences now:`
        }
      ]
    });

    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error('Groq API error:', err.message);
    return `This transaction was flagged because ${reasons.join(' and ')}. Please verify the recipient details before proceeding.`;
  }
}

module.exports = { explainFraud };