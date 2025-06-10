import query from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { provinceId } = req.query;

    if (!provinceId) {
        return res.status(400).json({ message: 'Province ID is required' });
    }

    try {
        const rows = await query(
            'SELECT amphur_id as id, name_th as name FROM amphurs WHERE province_id = ? ORDER BY name_th',
            [provinceId]
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Error fetching amphurs', error: error.message });
    }
}