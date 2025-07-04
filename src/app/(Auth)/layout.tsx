import Header from "@/features/common/Header";
import { Box } from "@mui/material";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      {children}
    </Box>
  );
};

export default AuthLayout;
