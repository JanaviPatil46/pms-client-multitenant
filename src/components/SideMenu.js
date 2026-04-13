import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Divider,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import MenuButton from "./MenuButton";

import { useNavigate } from "react-router-dom";
import { toast } from "material-react-toastify";

// ✅ Import API
import { accountsAPI } from "../services/api";

import Logo from "../Images/snplogo-removebg-preview.png";

const drawerWidth = 240;
const collapsedWidth = 72;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})(({ theme, collapsed }) => ({
  width: collapsed ? collapsedWidth : drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transition: theme.transitions.create("width"),
  "& .MuiDrawer-paper": {
    width: collapsed ? collapsedWidth : drawerWidth,
    overflowX: "hidden",
    transition: theme.transitions.create("width"),
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SideMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const [selectedAccount] = useState(
    sessionStorage.getItem("accountId")
  );
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const email = sessionStorage.getItem("email");

  const maxLength = 15;

  const truncate = (text) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // ================= FETCH ACCOUNT =================
  const fetchAccountInfo = async (accountId) => {
    if (!accountId) return;

    setLoading(true);
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccountInfo(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      fetchAccountInfo(selectedAccount);
    }
  }, [selectedAccount]);

  // ================= LOGOUT =================
  const logoutuser = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");

    toast.success("Logged out");

    navigate("/login");
  };

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <Drawer
      variant="permanent"
      collapsed={collapsed}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
            <img src={Logo} alt="Logo" style={{ height: 60 }} />
          </Box>
        )}

        <Tooltip placement="right" title={collapsed ? "Expand" : "Collapse"}>
          <Box
            onClick={toggleCollapse}
            sx={{
              cursor: "pointer",
              backgroundColor: "info.main",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {collapsed ? (
              <ChevronRightIcon sx={{ color: "white" }} />
            ) : (
              <ChevronLeftIcon sx={{ color: "white" }} />
            )}
          </Box>
        </Tooltip>
      </Box>

      <Divider />

      {/* ================= MENU ================= */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <MenuContent collapsed={collapsed} />
      </Box>

      {/* ================= COLLAPSED ACTIONS ================= */}
      {collapsed && (
        <>
          <Stack sx={{ p: 2 }}>
            <MenuButton>
              <SwitchAccountIcon />
            </MenuButton>
          </Stack>

          <Stack sx={{ p: 2 }}>
            <MenuButton onClick={logoutuser}>
              <LogoutRoundedIcon />
            </MenuButton>
          </Stack>
        </>
      )}

      {/* ================= FOOTER ================= */}
      {!collapsed ? (
        <Stack
          direction="row"
          sx={{
            p: 2,
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            src={
              accountInfo?.profilePicture
                ? `${accountInfo.profilePicture}`
                : undefined
            }
          >
            {!accountInfo?.profilePicture && (
              accountInfo?.accountName?.charAt(0)?.toUpperCase() || <PersonIcon />
            )}
          </Avatar>

          <Box sx={{ mr: "auto" }}>
            {loading ? (
              <Typography variant="caption">Loading...</Typography>
            ) : (
              <>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {truncate(accountInfo?.accountName)}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {truncate(email)}
                </Typography>
              </>
            )}
          </Box>

          <OptionsMenu email={email} />
        </Stack>
      ) : (
        <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Tooltip
            title={
              accountInfo
                ? `${accountInfo.accountName} • ${accountInfo.clientType}`
                : "No account"
            }
            placement="right"
          >
            <Avatar sx={{ width: 36, height: 36 }}>
              {accountInfo?.accountName?.charAt(0)?.toUpperCase() || <PersonIcon />}
            </Avatar>
          </Tooltip>
        </Box>
      )}
    </Drawer>
  );
}