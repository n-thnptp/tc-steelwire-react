import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import query from '../lib/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env.local') });

async function updateExistingAddresses() {
  try {
    // Get all addresses without coordinates, just using tambon
    const addresses = await query(`
      SELECT 
        sh.sh_id,
        t.name_th as tambon
      FROM shipping_address sh
      JOIN tambons t ON sh.tambon_id = t.tambon_id
      WHERE sh.latitude IS NULL OR sh.longitude IS NULL
    `);

    console.log(`Found ${addresses.length} addresses to update`);

    for (const addr of addresses) {
      try {
        // Just use tambon Thai name for geocoding
        const searchAddress = addr.tambon;
        console.log(`\nProcessing tambon: ${searchAddress}`);
        
        const searchResponse = await fetch(
          `https://search.longdo.com/mapsearch/json/search?keyword=${encodeURIComponent(searchAddress)}&key=${process.env.LONGDO_API_KEY}`
        );
        const searchData = await searchResponse.json();

        if (searchData.data?.[0]) {
          const coordinates = {
            lat: searchData.data[0].lat,
            lng: searchData.data[0].lon
          };

          await query(
            `UPDATE shipping_address 
             SET latitude = ?, longitude = ? 
             WHERE sh_id = ?`,
            [coordinates.lat, coordinates.lng, addr.sh_id]
          );

          console.log(`✅ Updated address ID: ${addr.sh_id} with coordinates:`, coordinates);
        } else {
          console.log(`❌ Could not find coordinates for tambon: ${searchAddress}`);
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Failed to update address ID ${addr.sh_id}:`, error);
      }
    }

    console.log('\nFinished updating addresses');

  } catch (error) {
    console.error('Error updating addresses:', error);
  }
}

updateExistingAddresses(); 