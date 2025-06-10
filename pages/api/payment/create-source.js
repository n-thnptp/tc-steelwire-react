const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { amount, bank, orderId } = req.body;

  try {
    const source = await omise.sources.create({
      type: 'internet_banking_' + bank,
      amount: amount * 100, // Convert to satang
      currency: 'thb',
    });

    const charge = await omise.charges.create({
      amount: amount * 100,
      currency: 'thb',
      source: source.id,
      return_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/confirm?orderId=${orderId}`,
      metadata: {
        orderId: orderId,
      },
    });

    res.json({
      status: 'success',
      authorizeUri: charge.authorize_uri
    });
  } catch (error) {
    console.error('Omise error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
} 