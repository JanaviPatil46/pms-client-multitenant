import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { Box, Divider, Badge, IconButton } from "@mui/material";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import AddIcon from "@mui/icons-material/Add";

import SecondSidebar from "./SecondSidebar";

import { IoNotifications } from "react-icons/io5";
import { color } from "framer-motion";
export default function Header() {
  const [openNewDrawer, setOpenNewDrawer] = React.useState(false);

  const [activeMenuItem, setActiveMenuItem] = React.useState(null);

  const toggleNewDrawer = (open) => () => {
    setOpenNewDrawer(open);
    if (!open) setActiveMenuItem(null); // Reset on close
  };

  const handleMenuItemClick = (itemText) => {
    setActiveMenuItem(itemText); // Set current menu item
  };

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          display: { xs: "none", md: "flex" },
          width: "100%",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          maxWidth: { sm: "100%", md: "1700px" },
          pt: 3,
          mb: 2.5,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />

        <Stack direction="row" sx={{ gap: 1 }}>

          <SecondSidebar
            open={openNewDrawer}
            toggleDrawer={toggleNewDrawer}
            onMenuItemClick={handleMenuItemClick}
          />


          <Badge
            badgeContent={4}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#FFA500", // Dark yellow (orange)
                color: "#000000", // Black text for contrast
              },
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuButton aria-label="Open notifications">
              <NotificationsRoundedIcon fontSize="medium" />
            </MenuButton>
          </Badge>
         
        </Stack>
      </Stack>
      <Divider />
    </Box>
  );
}