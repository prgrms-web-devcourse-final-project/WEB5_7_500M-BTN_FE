"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, Stack, Chip, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { ShopsItem } from "@/api/generated";
import { MyLocation } from "@mui/icons-material";
import { useGeolocation } from "@/hooks";
import { KAKAO_MAP_CONSTANTS } from "@/constants";

// window에 kakao 타입 선언
declare global {
  interface Window {
    kakao: unknown;
  }
}

interface ShopMapProps {
  shops?: ShopsItem[];
  selectedShopId?: number;
  onShopSelect?: (shop: ShopsItem) => void;
  onReSearch?: (center: { latitude: number; longitude: number }) => void;
}

const ShopMap: React.FC<ShopMapProps> = ({
  shops = [],
  selectedShopId,
  onShopSelect,
  onReSearch,
}) => {
  const { location: userLocation } = useGeolocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const router = useRouter();

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
    document.body.appendChild(script);

    script.onload = () => {
      if ((window.kakao as any)?.maps) {
        (window.kakao as any).maps.load(() => {
          initializeMap();
        });
      }
    };

    script.onerror = () => {
      console.error("카카오 지도 스크립트 로드 실패");
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // 지도 초기화
  const initializeMap = () => {
    if (!mapRef.current) return;

    // 사용자 위치가 있으면 사용자 위치로, 없으면 기본 위치로
    const center = userLocation
      ? new (window.kakao as any).maps.LatLng(
          userLocation.latitude,
          userLocation.longitude
        )
      : new (window.kakao as any).maps.LatLng(37.5724, 126.9794); // 종로구 기본 좌표

    mapInstance.current = new (window.kakao as any).maps.Map(mapRef.current, {
      center: center,
      level: 3,
    });

    // 인포윈도우 생성
    infoWindowRef.current = new (window.kakao as any).maps.InfoWindow({
      zIndex: 1,
      removable: true,
    });

    // 마커들 생성
    createMarkers();
  };

  // 마커 생성
  const createMarkers = () => {
    if (!mapInstance.current || !(window.kakao as any)?.maps) return;

    // 기존 마커들 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new (window.kakao as any).maps.LatLngBounds();

    shops.forEach((shop) => {
      if (!shop.latitude || !shop.longitude) return;

      const position = new (window.kakao as any).maps.LatLng(
        shop.latitude,
        shop.longitude
      );

      // 마커 생성
      const marker = new (window.kakao as any).maps.Marker({
        position: position,
        map: mapInstance.current,
      });

      // 마커 클릭 이벤트
      (window.kakao as any).maps.event.addListener(marker, "click", () => {
        showInfoWindow(marker, shop);
        if (onShopSelect) {
          onShopSelect(shop);
        }
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (shops.length > 0) {
      mapInstance.current.setBounds(bounds);
    }
  };

  // 인포윈도우 표시
  const showInfoWindow = (marker: any, shop: ShopsItem) => {
    if (!infoWindowRef.current) return;

    const content = `
      <div style="padding: 15px; min-width: 250px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #1976d2; cursor: pointer;" 
             onclick="window.shopDetailClick && window.shopDetailClick(${
               shop.shopId
             })"
             onmouseover="this.style.color='#1565c0'"
             onmouseout="this.style.color='#1976d2'">
          ${shop.shopName}
        </div>
        <div style="font-size: 13px; color: #666; margin-bottom: 6px; line-height: 1.4;">
          📍 ${shop.roadAddress || ""}
        </div>
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
          ⭐ 평점: ${shop.rating?.toFixed(1) || "0.0"} / 5.0
        </div>
        <div style="font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 8px;">
          클릭하여 상세정보 보기
        </div>
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstance.current, marker);

    // 전역 함수로 상세페이지 이동 함수 등록
    (window as any).shopDetailClick = (shopId: number) => {
      router.push(`/shop/${shopId}`);
    };
  };

  // 현재 지역에서 재탐색 함수
  const handleReSearch = () => {
    if (!mapInstance.current || !onReSearch) return;

    const center = mapInstance.current.getCenter();
    const latitude = center.getLat();
    const longitude = center.getLng();

    onReSearch({ latitude, longitude });
  };

  // shops 데이터 변경 시 마커 재생성
  useEffect(() => {
    if (mapInstance.current) {
      createMarkers();
    }
  }, [shops]);

  // 선택된 식당이 변경되면 해당 마커로 이동
  useEffect(() => {
    if (!mapInstance.current || !selectedShopId) return;

    const selectedShop = shops.find((shop) => shop.shopId === selectedShopId);
    if (selectedShop && selectedShop.latitude && selectedShop.longitude) {
      const position = new (window.kakao as any).maps.LatLng(
        selectedShop.latitude,
        selectedShop.longitude
      );
      mapInstance.current.setCenter(position);
      mapInstance.current.setLevel(2); // 줌 레벨 조정
    }
  }, [selectedShopId, shops]);

  // 사용자 위치가 변경되면 지도를 해당 위치로 이동
  useEffect(() => {
    if (!mapInstance.current || !userLocation) return;

    const position = new (window.kakao as any).maps.LatLng(
      userLocation.latitude,
      userLocation.longitude
    );
    mapInstance.current.setCenter(position);
    mapInstance.current.setLevel(3);
  }, [userLocation]);

  return (
    <Box width="100%" height="100vh" bgcolor="#e5e5e5" position="relative">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* 현재 지역에서 재탐색 버튼 오버레이 */}
      <Box
        position="absolute"
        top={16}
        left="50%"
        sx={{
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          startIcon={<MyLocation />}
          onClick={handleReSearch}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            color: "#1976d2",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            borderRadius: "24px",
            px: 3,
            py: 1,
            fontWeight: 600,
            fontSize: "14px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          현재 지역에서 재탐색
        </Button>
      </Box>
    </Box>
  );
};

export default ShopMap;
