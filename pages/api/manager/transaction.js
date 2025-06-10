import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const transactions = await query(
      `
        SELECT 
            transaction_id, 
            o_id, 
            filename, 
            price
        FROM transaction_history 
        `
    );

    return res.status(200).json({ transactions });

  } catch (error) {
    console.error('fetch transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}