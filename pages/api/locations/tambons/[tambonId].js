import query from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { tambonId } = req.query;

    if (!tambonId) {
        return res.status(400).json({ message: 'Tambon ID is required' });
    }

    try {
        const rows = await query(
            'SELECT zip_code FROM tambons WHERE tambon_id = ?',
            [tambonId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Zipcode not found' });
        }

        return res.status(200).json({ zipCode: rows[0].zip_code });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Error fetching zipcode', error: error.message });
    }
}
