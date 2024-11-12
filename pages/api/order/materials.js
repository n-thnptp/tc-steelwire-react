import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Fetch material types and sizes from the database
        const materialTypes = await query(
            `
            SELECT
                mt_id as id,
                name
            FROM material_type
            `
        );

        const materialSizes = await query(
            `
            SELECT
                ms_id as id,
                size,
                price
            FROM material_size ORDER BY size ASC
            `
        );

        console.log("material types: " + JSON.stringify(materialTypes));
        console.log("material sizes: " + JSON.stringify(materialSizes));

        res.status(200).json({
            materialTypes: materialTypes.map(type => ({
                id: type.id,
                name: type.name
            })),
            sizes: materialSizes.map(size => ({
                id: size.id,
                size: size.size,
                price: size.price
            }))
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
