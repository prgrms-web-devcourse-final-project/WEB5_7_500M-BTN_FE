import React, { memo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
} from "@mui/material";
import { formatPrice, truncateText } from "@/utils";

interface MemoizedCardProps {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  price?: number;
  status?: string;
  tags?: string[];
  onClick?: () => void;
  actions?: React.ReactNode;
  variant?: "default" | "compact" | "detailed";
}

const MemoizedCard = memo<MemoizedCardProps>(
  ({
    id,
    title,
    subtitle,
    description,
    imageUrl,
    rating,
    price,
    status,
    tags,
    onClick,
    actions,
    variant = "default",
  }) => {
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };

    const renderContent = () => {
      switch (variant) {
        case "compact":
          return (
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {subtitle}
                </Typography>
              )}
              {rating && (
                <Box display="flex" alignItems="center" mt={1}>
                  <Rating value={rating} size="small" readOnly />
                  <Typography variant="caption" ml={0.5}>
                    {rating.toFixed(1)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          );

        case "detailed":
          return (
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {subtitle}
                </Typography>
              )}
              {description && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {truncateText(description, 150)}
                </Typography>
              )}
              {tags && tags.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                  {tags.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {rating && (
                  <Box display="flex" alignItems="center">
                    <Rating value={rating} size="small" readOnly />
                    <Typography variant="body2" ml={0.5}>
                      {rating.toFixed(1)}
                    </Typography>
                  </Box>
                )}
                {price && (
                  <Typography variant="h6" fontWeight={600} color="primary">
                    {formatPrice(price)}
                  </Typography>
                )}
              </Box>
              {actions && <Box mt={2}>{actions}</Box>}
            </CardContent>
          );

        default:
          return (
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {subtitle}
                </Typography>
              )}
              {description && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {truncateText(description, 100)}
                </Typography>
              )}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {rating && (
                  <Box display="flex" alignItems="center">
                    <Rating value={rating} size="small" readOnly />
                    <Typography variant="caption" ml={0.5}>
                      {rating.toFixed(1)}
                    </Typography>
                  </Box>
                )}
                {price && (
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="primary"
                  >
                    {formatPrice(price)}
                  </Typography>
                )}
              </Box>
              {actions && <Box mt={1}>{actions}</Box>}
            </CardContent>
          );
      }
    };

    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: onClick ? "pointer" : "default",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": onClick
            ? {
                transform: "translateY(-2px)",
                boxShadow: 3,
              }
            : {},
        }}
        onClick={handleClick}
      >
        {imageUrl && (
          <CardMedia
            component="img"
            height={variant === "compact" ? 120 : 200}
            image={imageUrl}
            alt={title}
            sx={{ objectFit: "cover" }}
          />
        )}

        {renderContent()}

        {status && (
          <Box position="absolute" top={8} right={8}>
            <Chip
              label={status}
              size="small"
              color={status === "active" ? "success" : "default"}
              variant="filled"
            />
          </Box>
        )}
      </Card>
    );
  }
);

MemoizedCard.displayName = "MemoizedCard";

export default MemoizedCard;
