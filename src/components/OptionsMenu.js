import * as React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Divider, { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import MenuButton from "./MenuButton";
import { useContactAuth } from "../context/Context";
import { toast } from "material-react-toastify";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

export default function OptionsMenu() {
  const {
    accounts,
    logout,
  } = useContactAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openSwitchDialog, setOpenSwitchDialog] = useState(false);

  const [selectedAccount, setSelectedAccount] = useState(
    sessionStorage.getItem("accountId")
  );

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ================= SWITCH ACCOUNT =================
  const handleSwitchAccount = (accountId) => {
    sessionStorage.setItem("accountId", accountId);
    setSelectedAccount(accountId);

    toast.success("Switched Successfully");

    setOpenSwitchDialog(false);

    // reload to refresh dashboard data
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <React.Fragment>
      {/* MENU BUTTON */}
      <MenuButton onClick={handleClick}>
        <MoreVertRoundedIcon />
      </MenuButton>

      {/* DROPDOWN MENU */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: { padding: "4px" },
          [`& .${paperClasses.root}`]: { padding: 0 },
          [`& .${dividerClasses.root}`]: { margin: "4px -4px" },
        }}
      >
        {/* SWITCH ACCOUNT */}
        <MenuItem
          disabled={accounts.length <= 1}
          onClick={() => setOpenSwitchDialog(true)}
        >
          Switch Account
        </MenuItem>

        <Divider />

        {/* LOGOUT */}
        <MenuItem
          onClick={logout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      {/* SWITCH ACCOUNT DIALOG */}
      <Dialog
        open={openSwitchDialog}
        onClose={() => setOpenSwitchDialog(false)}
      >
        <DialogTitle>Switch Account</DialogTitle>

        <DialogContent dividers>
          {accounts.length > 1 ? (
            accounts.map((acc) => {
              const isCurrent = selectedAccount === acc._id;

              return (
                <Button
                  key={acc._id}
                  fullWidth
                  sx={{ mb: 1, justifyContent: "space-between" }}
                  variant={isCurrent ? "contained" : "outlined"}
                  onClick={() =>
                    !isCurrent && handleSwitchAccount(acc._id)
                  }
                >
                  {acc.accountName}
                  {isCurrent && (
                    <span style={{ fontSize: 12 }}>
                      (Current)
                    </span>
                  )}
                </Button>
              );
            })
          ) : (
            <p>No other accounts available</p>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenSwitchDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}