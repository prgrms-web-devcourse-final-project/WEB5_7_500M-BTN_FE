import { Box, Typography, InputBase, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Banner = () => {
  return (
    <Box
      sx={{
        height: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "primary.light",
        gap: 3,
      }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="center"
        color="primary.contrastText"
      >
        맛있는 발견의 시작
      </Typography>
      <Typography
        variant="h6"
        color="primary.contrastText"
        fontWeight={600}
        textAlign="center"
      >
        주변의 숨겨진 맛집을 찾고, 새로운 맛의 경험을 함께하세요
      </Typography>
      <Paper
        component="form"
        sx={{
          mt: 2,
          p: "2px 8px",
          display: "flex",
          alignItems: "center",
          width: 480,
          boxShadow: 1,
          borderRadius: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="맛집명, 지역명을 검색해보세요!"
          inputProps={{ "aria-label": "맛집명, 지역명을 검색해보세요!" }}
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
