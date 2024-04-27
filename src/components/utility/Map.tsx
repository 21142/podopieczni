import { GoogleMap, Marker } from '@react-google-maps/api';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import geocode from '~/lib/geocode';

interface MapProps {
  address: string;
  exactAddress?: boolean;
  className?: string;
}

type Location = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

const Map = (props: MapProps) => {
  const [location, setLocation] = useState<Location | null>(null);

  const mapRef = useRef<google.maps.Map>();
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const coordinates = await geocode(props.address);
        setLocation(coordinates);
        mapRef.current?.panTo(coordinates);
      } catch (error) {
        console.error('Error fetching location:', error);
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
    <div className={props.className ?? 'w-screen'}>
      {location && (
        <GoogleMap
          zoom={15}
          center={center}
          options={options}
          onLoad={onMapLoad}
          mapContainerClassName={props.className ?? 'h-[50vh]'}
        >
          {props.exactAddress && <Marker position={location} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
