import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullHeight?: boolean;
  center?: boolean;
}

const LoadingSpinner = ({
  message = "로딩 중...",
  size = 40,
  fullHeight = false,
  center = true,
}: LoadingSpinnerProps) => {
  const containerProps = {
    ...(fullHeight && { minHeight: "100vh" }),
    ...(center && {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),
  };

  return (
    <Box {...containerProps}>
      <Box textAlign="center">
        <CircularProgress size={size} />
        {message && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
