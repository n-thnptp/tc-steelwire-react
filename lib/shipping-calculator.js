export async function calculateShippingFee(searchTerm) {
  const FACTORY_LOCATION = {
    lat: 13.736717,
    lng: 100.523186
  };

  const FREE_SHIPPING_RADIUS = 80;
  const RATE_PER_KM = 35;

  try {
    console.log('Search term:', searchTerm);

    // Clean up the search term for Bangkok addresses
    let cleanedTerm = searchTerm;
    if (searchTerm.includes('กรุงเทพมหานคร')) {
      cleanedTerm = searchTerm
        .replace('ตำบล', 'แขวง')
        .replace('อำเภอเขต', 'เขต')
        .replace('จังหวัดกรุงเทพมหานคร', 'กรุงเทพมหานคร');
    }

    const searchAttempts = [
      cleanedTerm,
      // Try without district prefix
      cleanedTerm.replace('แขวง', '').replace('ตำบล', ''),
      // Try just the district and province
      cleanedTerm.split(' ').slice(-3).join(' '),
      // Try with just the district name and Bangkok
      `${cleanedTerm.split(' ')[1]} กรุงเทพมหานคร`
    ];

    let locationFound = null;

    for (const attempt of searchAttempts) {
      const searchUrl = `https://search.longdo.com/mapsearch/json/search?keyword=${encodeURIComponent(attempt)}&key=${process.env.LONGDO_API_KEY}`;
      console.log('Trying URL:', searchUrl);

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      console.log('Longdo response for', attempt, ':', searchData);

      if (searchData.data?.[0]) {
        locationFound = searchData.data[0];
        break;
      }
    }

    if (!locationFound) {
      throw new Error('Location not found after multiple attempts');
    }

    const customerLocation = {
      lat: locationFound.lat,
      lng: locationFound.lon
    };

    // Calculate distance and shipping fee
    const R = 6371;
    const dLat = (customerLocation.lat - FACTORY_LOCATION.lat) * Math.PI / 180;
    const dLon = (customerLocation.lng - FACTORY_LOCATION.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(FACTORY_LOCATION.lat * Math.PI / 180) * Math.cos(customerLocation.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;

    let shippingFee = 0;
    if (distanceKm > FREE_SHIPPING_RADIUS) {
      // Round up to the next full kilometer for the chargeable distance
      const chargeableDistance = Math.ceil(distanceKm - FREE_SHIPPING_RADIUS);
      shippingFee = chargeableDistance * RATE_PER_KM;
    }

    return {
      distance: Math.round(distanceKm * 10) / 10,
      shippingFee,
      coordinates: customerLocation
    };

  } catch (error) {
    console.error('Shipping calculation error:', error);
    throw error;
  }
} 