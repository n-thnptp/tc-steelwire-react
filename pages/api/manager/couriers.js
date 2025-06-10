import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const couriers = await query('SELECT * FROM courier');
        return res.status(200).json({ couriers });
    } catch (error) {
        console.error('Error fetching couriers:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 