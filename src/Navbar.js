import { useEffect, useState } from "react";
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

// ✅ Your existing API
import { sidebarAPI, accountsAPI } from "./services/api";

export default function Navbar() {
  const [menuItems, setMenuItems] = useState([]);
  const [accountInfo, setAccountInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const accountId = sessionStorage.getItem("accountId");
  const email = sessionStorage.getItem("email");

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
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccount();
  }, [accountId]);

  // ================= DARK MODE =================
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-b-2xl shadow-md">
      
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-6">
          
          {/* Logo */}
          <div className="text-2xl font-bold">≈</div>

          {/* 🔥 MENU FROM YOUR API */}
          <div className="flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = iconMapping[item.icon];

              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              return (
                <NavLink
                  key={item._id}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  }`}
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
          <div className="flex items-center bg-white/20 px-3 py-1 rounded-lg">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none px-2 text-sm placeholder-white"
            />
          </div>

          {/* Dark Mode */}
          <button onClick={toggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notification */}
          <Bell className="cursor-pointer" />

          {/* PROFILE */}
          <div className="relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={accountInfo?.profilePicture || "https://i.pravatar.cc/40"}
                className="w-8 h-8 rounded-full"
              />
              <ChevronDown size={16} />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg">
                
                <div className="px-4 py-2 border-b dark:border-gray-700">
                  <p className="font-medium text-sm">
                    {accountInfo?.accountName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TITLE */}
      {/* <div className="mt-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div> */}
    </div>
  );
}