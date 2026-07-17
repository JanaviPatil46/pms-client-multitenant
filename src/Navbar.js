import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, Sun, Moon, ChevronDown } from "lucide-react";

// ✅ SAME ICONS (MUI icons still work in Tailwind)
import HomeFilledIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import TelegramIcon from "@mui/icons-material/Telegram";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ArticleIcon from "@mui/icons-material/Article";
import PaymentsIcon from "@mui/icons-material/Payments";
import SettingsIcon from "@mui/icons-material/Settings";
import Logo from "./Images/snplogo-removebg-preview.png";
// ✅ Your existing API4

import { sidebarAPI, accountsAPI } from "./services/api";
import { useContactAuth } from "./context/Context"; // adjust path if needed
export default function Navbar() {
  const [menuItems, setMenuItems] = useState([]);
  const [accountInfo, setAccountInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
  const { logout, accounts, setSelectedAccount } = useContactAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const accountId = sessionStorage.getItem("accountId");
  const email = sessionStorage.getItem("email");

  const handleSwitchAccount = (id) => {
    if (id === accountId) return;

    setSelectedAccount(id);

    // refetch account info
    navigate("/home"); // or current route
  };
  // ================= ICON MAPPING =================
  const iconMapping = {
    HomeFilledIcon: HomeFilledIcon,
    DescriptionIcon: DescriptionIcon,
    TelegramIcon: TelegramIcon,
    EventNoteIcon: EventNoteIcon,
    ArticleIcon: ArticleIcon,
    PaymentsIcon: PaymentsIcon,
    SettingsIcon: SettingsIcon,
  };

  // ================= FETCH MENU =================
  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const res = await sidebarAPI.getSidebar();
        setMenuItems(res.data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };
    fetchSidebar();
  }, []);

  // ================= FETCH ACCOUNT =================
  useEffect(() => {
    const fetchAccount = async () => {
      if (!accountId) return;
      try {
        const res = await accountsAPI.getAccountById(accountId);
        setAccountInfo(res.data);
        console.log("accountinfo", res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccount();
  }, [accountId]);

  // ================= DARK MODE =================
  // useEffect(() => {
  //   const saved = localStorage.getItem("theme");
  //   if (saved === "dark") {
  //     document.documentElement.classList.add("dark");
  //     setDarkMode(true);
  //   }
  // }, []);

  // const toggleDarkMode = () => {
  //   document.documentElement.classList.toggle("dark");
  //   const isDark = document.documentElement.classList.contains("dark");
  //   localStorage.setItem("theme", isDark ? "dark" : "light");
  //   setDarkMode(isDark);
  // };

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      className="
    sticky top-0 z-50
    bg-card text-card-foreground
    border-b border-border
    px-6 py-3
  "
    >
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <img src={Logo} className="h-9 object-contain" />

          {/* MENU */}
          <div className="flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = iconMapping[item.icon];

              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              return (
                <NavLink
                  key={item._id}
                  to={item.path}
                  className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }
                `}
                >
                  {Icon && <Icon fontSize="small" />}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {/* <div
            className="
          flex items-center gap-2
          bg-muted px-3 py-1.5 rounded-lg
          border border-border
        "
          >
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="
              bg-transparent outline-none text-sm
              placeholder:text-muted-foreground
            "
            />
          </div> */}

          {/* Dark Mode */}
          {/* <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-muted transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button> */}

          {/* Notification */}
          {/* <button className="p-2 rounded-lg hover:bg-muted transition">
            <Bell size={18} />
          </button> */}

          {/* PROFILE */}
          {/* <div className="relative"> */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {/* Avatar */}
              <div
                className="
              w-9 h-9 rounded-full overflow-hidden
              bg-muted flex items-center justify-center
              border border-border
            "
              >
                {accountInfo?.profilePicture ? (
                  <img
                    src={`${process.env.REACT_APP_ACCOUNT_CONTACT}/${accountInfo.profilePicture}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">
                    {accountInfo?.accountName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <ChevronDown size={16} />
            </div>

            {/* DROPDOWN */}
            {dropdownOpen && (
              <div
                className="
              absolute right-0 mt-2 w-56
              bg-popover text-popover-foreground
              border border-border
              rounded-xl shadow-md overflow-hidden
            "
              >
                {/* USER INFO */}
                <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {accountInfo?.profilePicture ? (
                      <img
                        src={`${process.env.REACT_APP_ACCOUNT_CONTACT}/${accountInfo.profilePicture}`}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">
                        {accountInfo?.accountName?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-sm">
                      {accountInfo?.accountName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </div>
                </div>
                {/* SWITCH ACCOUNT */}
                {accounts.length > 1 && (
                  <div className="border-b border-border">
                    <p className="px-4 py-2 text-xs text-muted-foreground font-medium">
                      Switch Account
                    </p>

                    {accounts.map((acc) => (
                      <button
                        key={acc._id}
                        onClick={() => {
                          handleSwitchAccount(acc._id);
                          setDropdownOpen(false); // ✅ close
                        }}
                        // onClick={() => handleSwitchAccount(acc._id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition flex justify-between items-center
          ${acc._id === accountId ? "bg-primary/10 text-primary" : ""}
        `}
                      >
                        <span>{acc.accountName}</span>

                        {acc._id === accountId && (
                          <span className="text-xs font-medium">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {/* MENU ITEMS */}
                {/* <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-muted transition"
                >
                  Profile
                </button> */}

                <button
                  onClick={() => {
                    navigate("/settings");
                    setDropdownOpen(false);
                  }}
                  // onClick={() => navigate("/settings")}
                  className="w-full text-left px-4 py-2 hover:bg-muted transition"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-destructive hover:bg-muted transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
