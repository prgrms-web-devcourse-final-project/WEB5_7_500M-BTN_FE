import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (images.length + files.length > maxImages) {
      alert(`최대 ${maxImages}개까지 이미지를 업로드할 수 있습니다.`);
      return;
    }

    const newImages = [...images, ...files];
    onImagesChange(newImages);

    // 미리보기 URL 생성
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // 미리보기 URL 정리
    URL.revokeObjectURL(previewUrls[index]);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        이미지 첨부 ({images.length}/{maxImages})
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <ImageList
        sx={{ width: "100%", height: "auto" }}
        cols={3}
        rowHeight={120}
      >
        {images.map((image, index) => (
          <ImageListItem key={index} sx={{ position: "relative" }}>
            <img
              src={previewUrls[index] || URL.createObjectURL(image)}
              alt={`업로드된 이미지 ${index + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
              onClick={() => handleRemoveImage(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        ))}

        {images.length < maxImages && (
          <ImageListItem>
            <Paper
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #ccc",
                borderRadius: "8px",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
              onClick={handleAddClick}
            >
              <AddIcon sx={{ fontSize: 32, color: "text.secondary", mb: 1 }} />
              <Typography variant="caption" color="text.secondary">
                이미지 추가
              </Typography>
            </Paper>
          </ImageListItem>
        )}
      </ImageList>
    </Box>
  );
}
