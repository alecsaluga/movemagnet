const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

export async function findBusinessInfo(address: string): Promise<{
  businessName?: string;
  phoneNumber?: string;
}> {
  try {
    // First, get place ID using Places API
    const searchResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
      `input=${encodeURIComponent(address)}&` +
      `inputtype=textquery&` +
      `fields=place_id&` +
      `key=${GOOGLE_PLACES_API_KEY}`
    );
    
    const searchData = await searchResponse.json();
    if (!searchData.candidates?.[0]?.place_id) {
      return {};
    }

    // Then get place details
    const detailsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${searchData.candidates[0].place_id}&` +
      `fields=name,formatted_phone_number&` +
      `key=${GOOGLE_PLACES_API_KEY}`
    );
    
    const detailsData = await detailsResponse.json();
    const result = detailsData.result;

    return {
      businessName: result?.name,
      phoneNumber: result?.formatted_phone_number,
    };
  } catch (error) {
    console.error('Error fetching business info:', error);
    return {};
  }
}