"use client";

import * as React from "react";
import {
  Snackbar,
  Alert,
  AlertColor,
  Backdrop,
  CircularProgress,
} from "@mui/material";

interface ToastProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

export default function Toast({
  open,
  message,
  severity,
  onClose,
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

// 토스트 훅
export function useToast() {
  const [toast, setToast] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = React.useCallback(
    (message: string, severity: AlertColor = "info") => {
      setToast({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const hideToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}

// 전역 로딩 컴포넌트
interface GlobalLoadingProps {
  open: boolean;
  message?: string;
}

export function GlobalLoading({
  open,
  message = "로딩 중...",
}: GlobalLoadingProps) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: "column",
        gap: 2,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      <div style={{ color: "white", fontSize: "1rem" }}>{message}</div>
    </Backdrop>
  );
}

// 전역 로딩 훅
export function useGlobalLoading() {
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("로딩 중...");

  const showLoading = React.useCallback((message?: string) => {
    setLoading(true);
    if (message) {
      setLoadingMessage(message);
    }
  }, []);

  const hideLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  return {
    loading,
    loadingMessage,
    showLoading,
    hideLoading,
  };
}
