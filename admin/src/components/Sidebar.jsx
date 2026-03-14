import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Profile", path: "/profile", icon: "👤" },
    { label: "Skills", path: "/skills", icon: "⚡" },
    { label: "Projects", path: "/project", icon: "🚀" },
    { label: "Experience", path: "/experience", icon: "💼" },
    { label: "Education", path: "/education", icon: "🎓" },
    { label: "Messages", path: "/messages", icon: "✉️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-indigo-400">Admin Panel</h2>
      </div>
      <nav className="flex-1 mt-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
