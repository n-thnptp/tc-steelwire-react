import query from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { amphurId } = req.query;

    if (!amphurId) {
        return res.status(400).json({ message: 'Amphur ID is required' });
    }

    try {
        const rows = await query(
            'SELECT id, name_th as name, zip_code FROM tambons WHERE amphur_id = ? ORDER BY name_th',
            [amphurId]
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Error fetching tambons', error: error.message });
    }
}
