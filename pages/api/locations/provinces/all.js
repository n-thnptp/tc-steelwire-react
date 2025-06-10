import query from '../../../../lib/db';

export default async function handler(req, res) {
    
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {

        const rows = await query(`
            SELECT 
                p.province_id as id, 
                p.name_th as name, 
                p.name_en as name_en,
                g.name as geography
            FROM provinces p
            LEFT JOIN geography g ON p.geography_id = g.geography_id
            ORDER BY p.name_th ASC
        `);


        return res.status(200).json(rows);

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
            message: 'Error fetching provinces', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
