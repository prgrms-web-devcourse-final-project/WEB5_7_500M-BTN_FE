import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
}

const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        setIsLoading(false);
      },
      (err) => {
        // 위치 권한 거부 등 에러 시 기본값(종로구) 사용
        const defaultLocation = {
          latitude: 37.5724,
          longitude: 126.9794,
        };
        setLocation(defaultLocation);
        setError("위치 정보를 가져올 수 없어 기본 위치를 사용합니다.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      }
    );
  }, []);

  return { location, isLoading, error };
};

export default useGeolocation;
