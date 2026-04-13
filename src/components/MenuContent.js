import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AppTheme from "../shared-theme/AppTheme";

// Icons
import HomeFilledIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import TelegramIcon from "@mui/icons-material/Telegram";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ArticleIcon from "@mui/icons-material/Article";
import PaymentsIcon from "@mui/icons-material/Payments";
import SettingsIcon from "@mui/icons-material/Settings";

// ✅ Import API
import { sidebarAPI } from "../services/api";

export default function MenuContent({ collapsed }) {
  const iconMapping = {
    HomeFilledIcon: HomeFilledIcon,
    DescriptionIcon: DescriptionIcon,
    TelegramIcon: TelegramIcon,
    EventNoteIcon: EventNoteIcon,
    ArticleIcon: ArticleIcon,
    PaymentsIcon: PaymentsIcon,
    SettingsIcon: SettingsIcon,
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = React.useState([]);

  // ✅ Use API instead of fetch
  React.useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const res = await sidebarAPI.getSidebar();
        setMenuItems(res.data); // axios response
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };

    fetchSidebar();
  }, []);

  const renderMenuItem = (item) => {
    const isActive =
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/");

    const IconComponent = iconMapping[item.icon];

    return (
      <Tooltip
        title={collapsed ? item.label : ""}
        placement="right"
        key={item._id}
      >
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            selected={isActive}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1.2,
              minHeight: 48,
              justifyContent: collapsed ? "center" : "initial",
              px: 2.5,
            }}
          >
            {IconComponent && (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? "auto" : 3,
                  justifyContent: "center",
                }}
              >
                <IconComponent />
              </ListItemIcon>
            )}

            {!collapsed && (
              <ListItemText
                primary={item.label}
                sx={{
                  opacity: collapsed ? 0 : 1,
                  transition: "opacity 0.2s",
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </Tooltip>
    );
  };

  return (
    <AppTheme>
      <Stack
        sx={{
          flexGrow: 1,
          p: 1,
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <List dense sx={{ overflow: "hidden" }}>
          {menuItems.map(renderMenuItem)}
        </List>
      </Stack>
    </AppTheme>
  );
}