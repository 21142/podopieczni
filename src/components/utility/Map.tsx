import { GoogleMap, Marker } from '@react-google-maps/api';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface MapProps {
  address: string;
}

type Location = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

const Map = (props: MapProps) => {
  const [location, setLocation] = useState<Location | null>(null);

  const mapRef = useRef<google.maps.Map>();
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://maps.google.com/maps/api/geocode/json?address=${props.address}&sensor=false&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );

        if (!response.ok) {
          console.error(`Failed to fetch location: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results.length === 0) {
          console.error('No results found for the given location');
        }

        const { lat, lng } = data.results[0].geometry.location;

        setLocation({ lat, lng });
        mapRef.current?.panTo({ lat, lng });
      } catch (error) {
        setLocation(null);
      }
    };

    fetchLocation();
  }, [props.address]);

  const center = useMemo<Location>(
    () => (location ? location : { lat: 52.23, lng: 21.01 }),
    [location]
  );

  const options = useMemo<MapOptions>(() => {
    return {
      disableDefaultUI: true,
      clickableIcons: false,
    };
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  return (
    <div className="w-screen">
      {location && (
        <GoogleMap
          zoom={15}
          center={center}
          options={options}
          onLoad={onMapLoad}
          mapContainerClassName="h-[50vh]"
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
