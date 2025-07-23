"use client";

import { Box, Typography, InputBase, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box
      sx={{
        height: { xs: 280, sm: 320, md: 360 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "primary.light",
        gap: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="center"
        color="primary.contrastText"
        sx={{
          lineHeight: 1.2,
          fontSize: { xs: "2rem", sm: "3rem" },
        }}
      >
        맛있는 발견의 시작
      </Typography>
      <Typography
        variant="h6"
        color="primary.contrastText"
        fontWeight={600}
        textAlign="center"
        sx={{
          lineHeight: 1.4,
          fontSize: { xs: "1rem", sm: "1.25rem" },
        }}
      >
        주변의 숨겨진 맛집을 찾고, 새로운 맛의 경험을 함께하세요
      </Typography>
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          mt: { xs: 1, sm: 2 },
          p: "2px 8px",
          display: "flex",
          alignItems: "center",
          width: { xs: "100%", sm: 400, md: 480 },
          maxWidth: "100%",
          boxShadow: 1,
          borderRadius: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="맛집명, 지역명을 검색해보세요!"
          inputProps={{ "aria-label": "맛집명, 지역명을 검색해보세요!" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton
          type="submit"
          sx={{ p: "8px", "&:hover": { bgColor: "transparent" } }}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default Banner;
