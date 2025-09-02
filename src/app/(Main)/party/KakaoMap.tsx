import React, { useEffect, useRef } from "react";
import { KAKAO_MAP_CONSTANTS } from "@/constants";

interface KakaoMapProps {
  center?: { lat: number; lng: number };
  marker?: { lat: number; lng: number };
  markers?: { lat: number; lng: number }[];
  keyword?: string;
  onSearchResults?: (results: any[]) => void;
  zoomLevel?: number;
}

declare global {
  interface Window {
    kakao: unknown;
  }
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  center,
  marker,
  markers,
  keyword,
  onSearchResults,
  zoomLevel,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const markersInstance = useRef<any[]>([]);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const placesService = useRef<any>(null);

  // 지도 스크립트 로드 및 초기화
  useEffect(() => {
    if ((window.kakao as any)?.maps) {
      initializeMap();
      return;
    }
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_CONSTANTS.API_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      if ((window.kakao as any)?.maps) {
        (window.kakao as any).maps.load(() => {
          initializeMap();
        });
      }
    };
    document.body.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  // 지도 초기화
  const initializeMap = () => {
    if (!mapRef.current) return;
    const defaultCenter = new (window.kakao as any).maps.LatLng(
      center?.lat || 37.566826,
      center?.lng || 126.9786567
    );
    mapInstance.current = new (window.kakao as any).maps.Map(mapRef.current, {
      center: defaultCenter,
      level: zoomLevel || 3,
    });
    placesService.current = new (window.kakao as any).maps.services.Places();
    if (marker) {
      setMarker(marker, zoomLevel);
    }
    if (markers && markers.length > 0) {
      setMarkers(markers);
    }
  };

  // center, marker, markers, zoomLevel prop 변경 시 지도 이동/마커 갱신
  useEffect(() => {
    if (!mapInstance.current || !(window.kakao as any)?.maps) return;
    if (markers && markers.length > 0) {
      setMarkers(markers);
    } else {
      clearMarkers();
    }
    if (marker) {
      setMarker(marker, zoomLevel);
    } else {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
        markerInstance.current = null;
      }
    }
    if (center) {
      const latlng = new (window.kakao as any).maps.LatLng(
        center.lat,
        center.lng
      );
      mapInstance.current.setCenter(latlng);
    }
  }, [center, marker, markers, zoomLevel]);

  // keyword prop이 바뀔 때만 검색 실행
  useEffect(() => {
    if (!placesService.current || !keyword || !mapInstance.current) return;
    if (!keyword.trim()) return;
    const map = mapInstance.current;
    const centerLatLng = map.getCenter();
    const radius = 2000; // 2km
    placesService.current.keywordSearch(
      keyword,
      (data: any[], status: string) => {
        if (status === (window.kakao as any).maps.services.Status.OK) {
          if (onSearchResults) onSearchResults(data);
        } else {
          if (onSearchResults) onSearchResults([]);
        }
      },
      {
        location: centerLatLng,
        radius,
      }
    );
  }, [keyword, onSearchResults]);

  // 여러 마커 표시
  const setMarkers = (positions: { lat: number; lng: number }[]) => {
    clearMarkers();
    if (!mapInstance.current || !(window.kakao as any)?.maps) return;
    const bounds = new (window.kakao as any).maps.LatLngBounds();
    positions.forEach((pos) => {
      const latlng = new (window.kakao as any).maps.LatLng(pos.lat, pos.lng);
      const marker = new (window.kakao as any).maps.Marker({
        map: mapInstance.current,
        position: latlng,
      });
      markersInstance.current.push(marker);
      bounds.extend(latlng);
    });
    if (positions.length > 0) {
      mapInstance.current.setBounds(bounds);
      // 여러 개일 때는 기본 zoomLevel(3)로
      if (positions.length > 1) {
        mapInstance.current.setLevel(3);
      }
    }
  };

  // 마커 모두 제거
  const clearMarkers = () => {
    markersInstance.current.forEach((m) => m.setMap(null));
    markersInstance.current = [];
  };

  // 단일 마커(선택된 식당) 표시, zoomLevel=1이면 지도 줌
  const setMarker = (pos: { lat: number; lng: number }, zoom?: number) => {
    if (!mapInstance.current || !(window.kakao as any)?.maps) return;
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
    }
    const latlng = new (window.kakao as any).maps.LatLng(pos.lat, pos.lng);
    markerInstance.current = new (window.kakao as any).maps.Marker({
      map: mapInstance.current,
      position: latlng,
      zIndex: 10,
    });
    mapInstance.current.setCenter(latlng);
    if (zoom) {
      mapInstance.current.setLevel(zoom);
    }
  };

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        background: "#eee",
      }}
    />
  );
};

export default KakaoMap;
