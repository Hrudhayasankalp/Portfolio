import { Link } from "react-router-dom";

function Dashboard() {
  const cards = [
    { title: "Profile", path: "/profile", bgColor: "bg-blue-500", icon: "👤" },
    { title: "Skills", path: "/skills", bgColor: "bg-green-500", icon: "⚡" },
    { title: "Projects", path: "/project", bgColor: "bg-purple-500", icon: "🚀" },
    { title: "Experience", path: "/experience", bgColor: "bg-yellow-500", icon: "💼" },
    { title: "Education", path: "/education", bgColor: "bg-red-500", icon: "🎓" },
    { title: "Messages", path: "/messages", bgColor: "bg-teal-500", icon: "✉️" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 mt-2">Manage your portfolio data from the modules below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {card.title}
            </h3>
            <p className="text-gray-500 mt-2 text-sm">
              Click to view and edit {card.title.toLowerCase()}.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;