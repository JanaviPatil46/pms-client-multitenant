// import { useState } from "react";
// import { alpha } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import Box from "@mui/material/Box";

// import SideMenu from "./components/SideMenu";
// import AppTheme from "./shared-theme/AppTheme";

// import { Outlet } from "react-router-dom";

// export default function Dashboard(props) {
//   const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
//   return (
//     <AppTheme {...props}>
//       <CssBaseline enableColorScheme />
//       <Box sx={{ display: "flex" }}>
//         <SideMenu
//           collapsed={sideMenuCollapsed}
//           onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)}
//         />

//         {/* Main content */}
//         <Box component="main" sx={{ width: "100%" }}>
//           <Box
//             sx={(theme) => ({
//               flexGrow: 1,
//               backgroundColor: theme.vars
//                 ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
//                 : alpha(theme.palette.background.default, 1),
//               overflow: "auto",
//               // height: "88vh",
//               p: 2,
//               transition: theme.transitions.create("margin", {
//                 easing: theme.transitions.easing.sharp,
//                 duration: theme.transitions.duration.leavingScreen,
//               }),
//             })}
//           >
//             <Outlet />
//           </Box>
//         </Box>
//       </Box>
//     </AppTheme>
//   );
// }


import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Page Content (add top padding equal to navbar height) */}
      <div className="pt-16">
        {/* <div className="bg-white rounded-xl shadow-md p-6 min-h-[400px]"> */}
          <Outlet />
        {/* </div> */}
      </div>
    </div>
  );
}