import { createTheme } from "@mui/material/styles";
import { deepOrange, lime, green } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fc5c17", // 새로운 프라이머리 컬러
      light: "#f15100", // main보다 밝은 색상
      dark: "#ba3b00", // main보다 어두운 색상
      contrastText: "#fff",
    },
    secondary: {
      main: lime[500], // #CDDC39
      light: lime[200], // #E6EE9C
      dark: lime[800], // #9E9D24
      contrastText: "#333",
    },
    background: {
      default: "#fff", // 전체 배경 흰색
      paper: "#fff",
    },
    text: {
      primary: "#3a3333", // 진한 브라운
      secondary: "#6f6666", // 브라운
    },
    success: {
      main: green[500], // #4CAF50
    },
    warning: {
      main: deepOrange[500], // #FF5722
    },
    info: {
      main: "#64b5f6", // 파란색(포인트)
    },
    error: {
      main: "#d32f2f",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      "'NanumSquareRound', 'Pretendard', 'Noto Sans KR', 'Roboto', 'Arial', sans-serif",
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // 기본 스타일 오버라이드가 필요하면 여기에 추가
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px transparent inset",
            WebkitTextFillColor: "inherit",
            transition: "background-color 5000s ease-in-out 0s",
          },
        },
      },
    },
  },
});

export default theme;
