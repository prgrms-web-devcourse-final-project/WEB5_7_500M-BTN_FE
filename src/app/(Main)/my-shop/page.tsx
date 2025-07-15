"use client";
import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import CategoryIcon from "@mui/icons-material/Category";
import { shopItems } from "@/mock/shop";

const myShop = shopItems[0];

const MyShopPage = () => {
  const [images, setImages] = useState<string[]>(myShop.thumbnailList);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("최대 5장까지 업로드할 수 있습니다.");
      return;
    }
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((newImgs) => setImages([...images, ...newImgs]));
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // 드래그&드롭
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (!e.dataTransfer.files) return;
    const files = Array.from(e.dataTransfer.files);
    if (images.length + files.length > 5) {
      alert("최대 5장까지 업로드할 수 있습니다.");
      return;
    }
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((newImgs) => setImages([...images, ...newImgs]));
  };

  return (
    <Box>
      <Box
        px={12}
        p={12}
        sx={{ maxWidth: 1200, mx: "auto" }}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Typography variant="h4" fontWeight={800} mb={4}>
          내 식당 정보
        </Typography>
        {/* 이미지 업로드/미리보기 - 상단 */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 4,
            border: "none",
            background: "none",
            p: 0,
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            flexWrap="wrap"
            justifyContent="flex-start"
          >
            {images.map((img, idx) => (
              <Box
                key={idx}
                position="relative"
                sx={{
                  overflow: "hidden",
                  width: 100,
                  height: 100,
                  mr: 1,
                  mb: 1,
                  "&:hover .remove-btn": { opacity: 1 },
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`shop-img-${idx}`}
                  sx={{ width: 100, height: 100, objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  className="remove-btn"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(255,255,255,0.8)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  onClick={() => handleRemoveImage(idx)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {images.length < 5 && (
              <Box>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  ref={fileInputRef}
                  onChange={handleAddImage}
                />
                <Tooltip title="사진 추가 (드래그&드롭 지원)">
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      width: 100,
                      height: 100,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 700,
                    }}
                    startIcon={<AddPhotoAlternateIcon sx={{ fontSize: 32 }} />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    추가
                  </Button>
                </Tooltip>
              </Box>
            )}
          </Stack>
          <Box ml={4} flex={1} minWidth={220}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              사진 (최대 5장)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              이미지를 드래그&드롭하거나, 버튼을 눌러 업로드하세요.
            </Typography>
          </Box>
        </Box>
        {/* 식당 상세정보 - 하단 */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ p: 0 }}>
          <Stack spacing={2} alignItems="flex-start">
            <Typography
              variant="h5"
              fontWeight={800}
              color="primary.main"
              mb={1}
            >
              {myShop.name}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <CategoryIcon color="action" fontSize="small" />
              <Typography variant="body1" color="text.secondary">
                {myShop.category}
              </Typography>
              <StarIcon sx={{ color: "#FFD600", ml: 2 }} fontSize="small" />
              <Typography variant="body1" color="text.secondary">
                {myShop.rating.toFixed(1)}
              </Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" mb={1}>
              {myShop.description}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {myShop.address}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {myShop.contact}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {myShop.businessHours}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default MyShopPage;
