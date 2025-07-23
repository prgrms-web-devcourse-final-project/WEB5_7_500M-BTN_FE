"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { logger } from "@/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("ErrorBoundary caught an error", { error, errorInfo });
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          p={3}
        >
          <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              오류가 발생했습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
            </Typography>
            <Button
              variant="contained"
              onClick={this.handleRetry}
              sx={{ mt: 1 }}
            >
              다시 시도
            </Button>
          </Alert>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <Box
              mt={2}
              p={2}
              bgcolor="grey.100"
              borderRadius={1}
              maxWidth={600}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {this.state.error.toString()}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
