import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        <header className="bg-white shadow-sm px-8 py-4 sticky top-0 z-10 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Welcome Admin</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
