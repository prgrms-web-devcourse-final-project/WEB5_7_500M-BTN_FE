import { Box, Typography, Button } from "@mui/material";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: "small" | "medium" | "large";
}

const EmptyState = ({
  title,
  description,
  icon,
  action,
  size = "medium",
}: EmptyStateProps) => {
  const sizeConfig = {
    small: { py: 3, iconSize: 48 },
    medium: { py: 6, iconSize: 64 },
    large: { py: 8, iconSize: 80 },
  };

  const config = sizeConfig[size];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={config.py}
      textAlign="center"
    >
      {icon && (
        <Box
          mb={2}
          color="text.secondary"
          sx={{
            fontSize: config.iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        variant={size === "small" ? "h6" : "h5"}
        fontWeight={600}
        gutterBottom
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          mb={action ? 2 : 0}
          maxWidth={400}
        >
          {description}
        </Typography>
      )}

      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          size={size === "small" ? "small" : "medium"}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
