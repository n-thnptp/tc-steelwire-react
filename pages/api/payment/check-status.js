const omise = require('omise')({
  secretKey: process.env.OMISE_SECRET_KEY,
  publicKey: process.env.OMISE_PUBLIC_KEY,
});

export default async function handler(req, res) {
  const { chargeId } = req.query;

  try {
    const charge = await omise.charges.retrieve(chargeId);
    res.json({ status: charge.status });
  } catch (error) {
    console.error('Omise error:', error);
    res.status(500).json({ error: error.message });
  }
} 