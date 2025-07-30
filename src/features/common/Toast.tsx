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

// 토스트 Context 타입
interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
  hideToast: () => void;
}

// 토스트 Context 생성
const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

// 토스트 Provider 컴포넌트
export function ToastProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}

// 토스트 훅 (기존 호환성을 위해 유지)
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
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
  const [message, setMessage] = React.useState("로딩 중...");

  const showLoading = React.useCallback((msg?: string) => {
    if (msg) setMessage(msg);
    setLoading(true);
  }, []);

  const hideLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  return {
    loading,
    message,
    showLoading,
    hideLoading,
  };
}
