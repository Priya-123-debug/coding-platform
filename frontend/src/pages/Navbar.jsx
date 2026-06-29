

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/authSlice";
import { User } from "lucide-react";

const Navbar = ({ filter, setfilter, isUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Get logged-in user from Redux
  const { user } = useSelector((state) => state.auth);

  // 🔹 Logout handler
  const handleLogout = () => {
    dispatch(logoutUser());

    // redirect after logout (optional but recommended)
    navigate("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar bg-base-100 shadow-lg px-4">

        {/* 🔹 Left: Logo */}
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl">
            Leetcode
          </NavLink>
        </div>

        {/* 🔹 Right: Profile Dropdown */}
        <div className="dropdown dropdown-end">

          {/* ========== Trigger (Icon + Name) ========== */}
          <div
            tabIndex={0}
            role="button"
            className="flex items-center gap-2 cursor-pointer"
          >
            {/* Avatar Icon */}
            <div
              className="w-10 h-10 rounded-full bg-gray-200
                         flex items-center justify-center
                         hover:bg-gray-300 transition"
            >
              <User className="w-5 h-5 text-gray-700" />
            </div>

           
            {/* <span className="font-medium hidden sm:block">
              {user?.firstname || user?.email || "User"}
            </span> */}
          </div>

          {/* ========== Dropdown Menu ========== */}
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-sm
                       dropdown-content bg-base-100
                       rounded-box w-56 z-[100]"
          >
            {/* ----- User Info Header ----- */}
            <li className="px-4 py-2 border-b cursor-default">
              <p className="font-semibold text-xl">
                {user?.firstname || "User"}
              </p>
              <p className=" text-gray-500 break-all text-[16px]">
                {user?.email}
              </p>
            </li>

            {/* ----- Menu Options ----- */}
            <li>
              <button onClick={() => navigate("/profile")} className="text-[16px]">
                Profile
              </button>
            </li>

            <li>
              <button onClick={() => navigate("/submissions")} className="text-[16px]">
                My Submissions
              </button>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 text-[20px]"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ================= FILTER BAR ================= */}
      {/* Visible only for normal users */}

      {isUser && user?.role !== "admin" && filter && setfilter && (
        <div className="flex gap-4 mb-4 pt-4 px-4 bg-base-100 shadow">

          {/* Status Filter */}
          <select
            className="select select-bordered"
            value={filter.status}
            onChange={(e) =>
              setfilter({ ...filter, status: e.target.value })
            }
          >
            <option value="all">All problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          {/* Difficulty Filter */}
          <select
            className="select select-bordered"
            value={filter.difficulty}
            onChange={(e) =>
              setfilter({
                ...filter,
                difficulty: e.target.value,
              })
            }
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Tag Filter */}
          <select
            className="select select-bordered"
            value={filter.tag}
            onChange={(e) =>
              setfilter({
                ...filter,
                tag: e.target.value,
              })
            }
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="LinkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>
      )}
    </>
  );
};

export default Navbar;

