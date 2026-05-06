
// import React from "react";
// import { Button } from "@mui/material";
// import { useTheme } from "@mui/material/styles";

// const SelectableButton = ({
//   selected = false,
//   disabled = false,
//   onClick,
//   children,
// }) => {
//   const theme = useTheme();

//   return (
//     <Button
//       variant={selected ? "" : "outlined"}
//       disabled={disabled}
//       onClick={() => !disabled && onClick?.()}
//       sx={{
//         borderRadius: "15px",
//         transition: "background-color 0.2s ease",
//         ...(selected && {
//           backgroundColor: theme.palette.text.menu,        // teal
//           color: theme.palette.primary.contrastText,       // white (or theme-contrast)
//           "&:hover": {
//             backgroundColor: theme.palette.menu.dark,      // darker teal on hover
//             boxShadow: 1,
//           },
//           "&.Mui-disabled": {
//             backgroundColor: theme.palette.text.menu,      // stay teal even if disabled
//             color: theme.palette.primary.contrastText,
//           },
//         }),
//       }}
//     >
//       {children}
//     </Button>
//   );
// };

// export default SelectableButton;

import React from "react";

const SelectableButton = ({
  selected = false,
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && onClick?.()}
      className={`
        rounded-[15px] px-4 py-1.5 text-sm font-medium
        transition-all duration-200
        border

        ${selected
          ? `
            bg-teal-600 text-white border-transparent
            hover:bg-teal-700
            dark:bg-teal-500 dark:hover:bg-teal-600
          `
          : `
            bg-transparent
            border-gray-300 text-gray-700
            hover:bg-gray-100
            dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800
          `
        }

        ${disabled
          ? `
            cursor-not-allowed opacity-60
            ${selected ? "bg-teal-600 text-white dark:bg-teal-500" : ""}
          `
          : "cursor-pointer"
        }
      `}
    >
      {children}
    </button>
  );
};

export default SelectableButton;