/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getTodayDate } from './utils';

export async function checkNIP(nip: string): Promise<boolean> {
  const date = getTodayDate();
  const url = `https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${date}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);

    return !!data.result?.subject;
  } catch (error) {
    console.error('Error checking NIP:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
}
