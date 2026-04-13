import * as React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { accountsAPI } from "../services/api";

function SideMenuMobile({ open, toggleDrawer }) {
  const navigate = useNavigate();

  const [accountId] = useState(sessionStorage.getItem("accountId"));
  const [accountInfo, setAccountInfo] = useState(null);

  const maxLength = 15;

  const truncate = (text) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // ✅ Fetch account details
  const fetchAccountDetails = async () => {
    try {
      if (!accountId) return;

      const res = await accountsAPI.getAccountById(accountId);
      setAccountInfo(res.data);

      console.log("result", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  // ✅ Logout
  const logoutuser = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("accountId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("accounts");

    navigate("/client/login");
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack sx={{ maxWidth: "70dvw", height: "100%" }}>
        {/* HEADER */}
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            {accountInfo ? (
              <>
                <Avatar sx={{ width: 24, height: 24 }} />

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: "16px" }}
                >
                  {truncate(accountInfo?.accountName)}
                </Typography>
              </>
            ) : (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Loading...
              </Typography>
            )}
          </Stack>

          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>

        <Divider />

        {/* MENU */}
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>

        <CardAlert />

        {/* LOGOUT */}
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={logoutuser}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;