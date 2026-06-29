import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import axiosClient from "../utilis/axiosClient";
import { logoutUser } from "../store/authSlice";
import { useEffect } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
// import { set } from 'zod/v3';

const Homepage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setproblems] = useState([]);
  const [solvedproblem, setsolvedproblem] = useState([]);

  const [filter, setfilter] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });
  const tagColors = {
    array: "bg-blue-500 text-white",
    linkedlist: "bg-indigo-500 text-white",
    graph: "bg-orange-500 text-white",
    dp: "bg-purple-500 text-white",
  };

  useEffect(() => {
    const fetchproblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getallproblem");
       
        setproblems(data);
      } catch (err) {
        console.log("error fetching problem:", err);
      }
    };
    const fetchSolvedproblem = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemsolvedbyuser");
 console.log("Solved Problems:", data); 
      setsolvedproblem(data.user.problemsolved);

      } catch (err) {
        console.log("error fetching solved problems:", err);
      }
    };
    fetchproblems();
    if (user) fetchSolvedproblem();
  }, [user]);
  const handleLogout = () => {
    dispatch(logoutUser());
    setsolvedproblem([]); // clear solved problem on logout
  };
  let statusMatch = false;
  const filteredproblems = problems.filter((problem) => {
    const difficultyMatch =
      filter.difficulty === "all" || problem.difficulty === filter.difficulty;
    const tagMatch = filter.tag === "all" || problem.tags === filter.tag;
    statusMatch =
      filter.status === "all" ||
      solvedproblem.some((sp) => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });
  return (
    <div className="min-h-screen bg-base-200">
      {/* hiiiii  supriya */}
      <Navbar
        filter={filter}
        setfilter={setfilter}
        isUser={user?.role === "user"}
      ></Navbar>
      {/* main container */}
      <div className="container mx-auto pt-6 pl-8 gap-4 flex flex-col">
        {/* <div className='flex gap-8 mb-4 pt-4'>



        {/* problem display section */}
        <div className="grid grid-cols-1 gap-4 ">
          {user?.role === "user"
            ? filteredproblems.map((problem) => {
                const diff = problem.difficulty?.trim().toLowerCase();
                // const issolved=solvedproblem.some((sp)=>sp._id===problem._id);
                const issolved =
                  Array.isArray(solvedproblem) &&
                  solvedproblem.some((sp) => sp._id === problem._id);

                return (
                  <div
                    key={problem._id}
                    className="bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-sm p-4 w-250 flex flex-col md:flex-row justify-between items-start hover:bg-[#333333] hover:shadow-md transition  "
                  >
                    <div className="flex flex-col">
                      {/* <h2 className='text-xl font-semibold mb-2'>{problem.title}</h2> */}
                      <Link
                        to={`/problem/${problem._id}`}
                        className="text-xl font-semibold mb-2 cursor-pointer"
                      >
                        {problem.title}
                      </Link>

                      <div className="flex  w-1/4">
                        {/* <span className="text-sm font-semibold mb-1">Difficulty</span> */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
      ${
        diff === "easy"
          ? "bg-green-100 text-green-700"
          : diff === "medium"
          ? "bg-yellow-100 text-yellow-700"
          : diff === "hard"
          ? "bg-red-100 text-red-700"
          : "bg-gray-200 text-gray-700"
      }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <div className="flex gap-4 pl-8 ml-4  items-center justify-center ">
                        {problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`   px-2 py-1 rounded-full text-xs font-semibold font-lg  flex  items-center justify-center ${
                              tagColors[tag.toLowerCase()] ||
                              "bg-gray-500 text-white"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm mb-4">
                      {/* Status:{""} */}
                      {issolved ? (
                        <span className="text-yellow-600 font-semibold">
                          Solved ✅
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          Unsolved{" "}
                        </span>
                      )}
                    </p>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
