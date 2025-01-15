import { env } from '@/lib/env';

export interface PlacesResult {
  businessName: string | null;
  phoneNumber: string | null;
}

export async function findBusinessAtAddress(address: string): Promise<PlacesResult> {
  try {
    // First, get place ID
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
    searchUrl.searchParams.set('input', address);
    searchUrl.searchParams.set('inputtype', 'textquery');
    searchUrl.searchParams.set('fields', 'place_id');
    searchUrl.searchParams.set('key', env.GOOGLE_PLACES_API_KEY);

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.candidates?.[0]?.place_id) {
      return { businessName: null, phoneNumber: null };
    }

    // Get place details
    const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    detailsUrl.searchParams.set('place_id', searchData.candidates[0].place_id);
    detailsUrl.searchParams.set('fields', 'name,formatted_phone_number');
    detailsUrl.searchParams.set('key', env.GOOGLE_PLACES_API_KEY);

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    return {
      businessName: detailsData.result?.name || null,
      phoneNumber: detailsData.result?.formatted_phone_number || null,
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return { businessName: null, phoneNumber: null };
  }
}