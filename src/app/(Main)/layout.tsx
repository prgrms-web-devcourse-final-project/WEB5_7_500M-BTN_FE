import { Box } from "@mui/material";
import Header from "@/features/common/Header";
import {
  Home as HomeIcon,
  Restaurant as RestaurantIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  Support as SupportIcon,
} from "@mui/icons-material";

const menuItems = [
  { text: "홈", icon: <HomeIcon />, href: "/" },
  { text: "식당", icon: <RestaurantIcon />, href: "/shop" },
  { text: "파티", icon: <GroupIcon />, href: "/party" },
  { text: "채팅", icon: <ChatIcon />, href: "/chat" },
  { text: "고객센터", icon: <SupportIcon />, href: "/customer-service" },
  { text: "프로필", icon: <PersonIcon />, href: "/profile" },
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <Header />
      {children}
    </Box>
  );
};

export default MainLayout;
