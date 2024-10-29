import query from '../../../lib/db';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'POST':
            try {
                const { feature, weight, length, sm_id } = req.body;

                // Validate input
                if (!feature || !weight || !length || !sm_id) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Missing required fields' 
                    });
                }

                const result = await query(
                    'INSERT INTO `product` (feature, weight, length, sm_id) VALUES (?, ?, ?, ?)',
                    [feature, weight, length, sm_id]
                );

                return res.status(201).json({
                    success: true,
                    data: { id: result.insertId }
                });

            } catch (error) {
                console.error('Error creating product:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error creating product' 
                });
            }
            break;

        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}