
// import { Outlet } from "react-router-dom";
// import { Box, Typography, AppBar, Toolbar, Button, Container } from "@mui/material";

// export default function Dashboard(props) {
//   const handleLogout = () => {
//     sessionStorage.clear();
//     window.location.href = "/login";
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       {/* Simple App Bar */}
//       <AppBar position="static" sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             Dashboard
//           </Typography>
//           <Button color="inherit" onClick={handleLogout}>
//             Logout
//           </Button>
//         </Toolbar>
//       </AppBar>

//       {/* Main Content */}
//       <Container sx={{ mt: 4 }}>
//         <Outlet />
//       </Container>
//     </Box>
//   );
// }

import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

// Example icon mapping
import HomeFilledIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import TelegramIcon from "@mui/icons-material/Telegram";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ArticleIcon from "@mui/icons-material/Article";
import PaymentsIcon from "@mui/icons-material/Payments";
import SettingsIcon from "@mui/icons-material/Settings";
import { sidebarAPI } from "./services/api";
import { toast } from "material-react-toastify";
const iconMap = {
  HomeFilledIcon: <HomeFilledIcon />,
  DescriptionIcon: <DescriptionIcon />,
  TelegramIcon: <TelegramIcon />,
  EventNoteIcon: <EventNoteIcon />,
  ArticleIcon: <ArticleIcon />,
  PaymentsIcon: <PaymentsIcon />,
  SettingsIcon: <SettingsIcon />,
};

const drawerWidth = 240;

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuItems, setMenuItems] = useState([]);

  // 🔹 Fetch Sidebar
  const fetchSidebar = async () => {
    try {
      const res = await sidebarAPI.getSidebar();
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  useEffect(() => {
    fetchSidebar();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logout Successfully!")
    navigate("/login")
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* ================= TOP BAR ================= */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: 8,
          },
        }}
      >
        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item._id}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>
                {iconMap[item.icon] || <HomeFilledIcon />}
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* ================= MAIN CONTENT ================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // ml: `${drawerWidth}px`,
          mt: 8,
          p: 3,
          background: "#f7f7fb",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}