import { Box } from "@mui/material";
import Header from "@/features/common/Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <Header />
      {children}
    </Box>
  );
};

export default MainLayout;
