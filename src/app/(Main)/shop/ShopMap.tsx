"use client";
import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const KAKAO_API_KEY = "c1ae6914a310b40050898f16a0aebb5f";

// window에 kakao 타입 선언
declare global {
  interface Window {
    kakao: unknown;
  }
}

const ShopMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 카카오 지도 API 스크립트 동적 로드
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("onload");
      if (window.kakao && mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.kakao as any).maps.load(() => {
          const options = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            center: new (window.kakao as any).maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
            level: 3,
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          new (window.kakao as any).maps.Map(mapRef.current, options);
        });
      }
    };

    script.onerror = () => {
      console.error("카카오 지도 스크립트 로드 실패");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box width="100%" height="100vh" bgcolor="#e5e5e5">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
};

export default ShopMap;
