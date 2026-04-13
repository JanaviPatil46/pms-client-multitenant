// import { useEffect, useState } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { Box } from "@mui/material";
// import SideMenu from "./components/SideMenu";

// import { sidebarAPI } from "./services/api";
// import { toast } from "material-react-toastify";
// import Header from "./components/Header";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   // 🔹 Fetch Sidebar
//   const fetchSidebar = async () => {
//     try {
//       const res = await sidebarAPI.getSidebar();
//       setMenuItems(res.data);
//     } catch (err) {
//       console.error("Failed to fetch menu:", err);
//     }
//   };

//   useEffect(() => {
//     fetchSidebar();
//   }, []);

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* ================= TOP BAR ================= */}

//       <SideMenu />

//       <Header />

//       {/* ================= MAIN CONTENT ================= */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,

//           p: 3,

//           minHeight: "100vh",
//         }}
//       >
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }


import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import AppTheme from "./shared-theme/AppTheme";

import { Outlet } from "react-router-dom";
import {  CircularProgress } from "@mui/material";

import { sidebarAPI } from "./services/api";
import { toast } from "material-react-toastify";

export default function Dashboard(props) {
  
    const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);


  return (
   <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu
          collapsed={sideMenuCollapsed}
          onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)}
        />
        <AppNavbar />

        {/* Main content */}
        <Box component="main" sx={{ width: "100%" }}>
          <Box
            sx={{
              alignItems: "center",
              mx: 3,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
          </Box>

          <Box
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: "auto",
              height: "88vh",
              p: 2,
              transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            })}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}