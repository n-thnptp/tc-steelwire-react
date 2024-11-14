import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import query from '../../../lib/db';
import Tesseract from 'tesseract.js';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let files;
    try {
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = formidable({
            uploadDir: uploadDir,
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB limit
        });

        const [fields, parsedFiles] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });
        files = parsedFiles;

        console.log('Received fields:', fields);
        console.log('Received files:', files);

        const file = files.file[0];
        if (!file) {
            throw new Error('No file uploaded');
        }

        const timestamp = new Date().getTime();
        const fileExt = path.extname(file.originalFilename || '.jpg');
        const filename = `slip_${fields.orderId[0]}_${timestamp}${fileExt}`;
        const newPath = path.join(uploadDir, filename);

        await fs.promises.rename(file.filepath, newPath);

        try {
            const transactionId = `TR${timestamp}`;

            // Insert into transaction_history first
            await query(
                'INSERT INTO transaction_history (transaction_id, o_id, filename, price) VALUES (?, ?, ?, ?)',
                [
                    transactionId, 
                    fields.orderId[0], 
                    filename, 
                    parseFloat(fields.amount[0])
                ]
            );

            // Then update order status
            await query(
                'UPDATE `order` SET o_status_id = 2 WHERE o_id = ?',
                [fields.orderId[0]]
            );

            res.json({ 
                success: true,
                filename: filename,
                transaction_id: transactionId
            });

        } catch (error) {
            console.error('Database error:', error);
            
            // If there's a database error, try to clean up the uploaded file
            if (fs.existsSync(newPath)) {
                fs.unlinkSync(newPath);
            }
            
            throw error;
        }

    } catch (error) {
        console.error('Error handling upload:', error);
        
        // Clean up any partially uploaded files
        if (files?.file?.[0]?.filepath && fs.existsSync(files.file[0].filepath)) {
            fs.unlinkSync(files.file[0].filepath);
        }

        res.status(500).json({ 
            error: 'Failed to process payment',
            message: error.message
        });
    }
}

async function extractReferenceCode(imagePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'tha+eng',  // Use both Thai and English recognition
            { logger: m => console.log(m) }
        );

        // Look for reference code pattern after "รหัสอ้างอิง"
        // Updated pattern to match SCB slip format
        const match = text.match(/รหัสอ้างอิง:?\s*([0-9A-Za-z]+)/);
        if (match && match[1]) {
            const refCode = match[1].trim();
            console.log('Extracted reference code:', refCode);
            return refCode;
        }

        console.log('No reference code found in text:', text);
        return null;
    } catch (error) {
        console.error('Error extracting reference code:', error);
        return null;
    }
} 