// pages/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";

const Adminlayout = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1B] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Content wrapper */}
      <div className="flex flex-1 border-t border-gray-700">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${
            isOpen ? "w-56" : "w-14"
          } bg-[#2C2C2E] flex flex-col border-r border-gray-700`}
        >
          <div className="flex justify-end p-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? (
                <X size={22} color="#FFA116" />
              ) : (
                <Menu size={22} color="#FFA116" />
              )}
            </button>
          </div>

          {isOpen && (
            <div className="flex-1 overflow-y-auto">
              <h2 className="text-lg font-bold mb-4 px-4 text-blue-400">
                Admin Panel
              </h2>
              <ul className="space-y-2 px-4">
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold text-[#FFA116]"
                        : "text-gray-300 hover:text-[#FFA116]"
                    }
                  >
                    All Problems
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/create"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold text-[#FFA116]"
                        : "text-gray-300 hover:text-[#FFA116]"
                    }
                  >
                    Create Problem
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 bg-[#1E1E1F] p-6 overflow-y-auto border-l border-gray-700">
          <div className="border border-gray-700 rounded-xl p-6 min-h-[calc(100vh-80px)]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminlayout;
