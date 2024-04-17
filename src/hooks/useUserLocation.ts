import { useEffect, useState } from 'react';
import { type Location } from '~/lib/geocode';
import { getLocation } from '~/lib/location';

const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getLocation();
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocation();
  }, []);

  return { userLocation };
};

export default useUserLocation;
