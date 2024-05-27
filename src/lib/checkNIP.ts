/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getTodayDate } from './utils';

export async function checkNIP(nip: string): Promise<boolean> {
  const date = getTodayDate();
  const url = `https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${date}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return !!data.result?.subject;
  } catch (error) {
    console.error('Error checking NIP:', error);
    return false;
  }
}
