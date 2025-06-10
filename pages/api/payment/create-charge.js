const omise = require('omise')({
  secretKey: process.env.OMISE_SECRET_KEY,
  publicKey: process.env.OMISE_PUBLIC_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { amount, orderId } = req.body;

  try {
    // Create source
    const source = await omise.sources.create({
      type: 'promptpay',
      amount: amount * 100, // Convert to satang
      currency: 'thb',
    });

    // Create charge
    const charge = await omise.charges.create({
      amount: amount * 100,
      currency: 'thb',
      source: source.id,
      metadata: {
        orderId: orderId,
      },
    });

    res.json({
      success: true,
      charge: charge, // Contains the QR code URL in charge.source.image.download_uri
    });
  } catch (error) {
    console.error('Omise error:', error);
    res.status(500).json({ error: error.message });
  }
} 