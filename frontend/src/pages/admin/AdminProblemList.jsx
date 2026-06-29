import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../utilis/axiosClient";

const AdminProblemList = () => {
  const [problems, setproblems] = useState([]);
  const [loading, setloading] = useState(false);
  const fetchproblems = async () => {
    try {
      const res = await axiosClient.get("/problem/getallproblem");
      setproblems(res.data);
    } catch (err) {
      console.log("error fetching problems", err);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchproblems();
  }, []);
  const deleteproblem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setproblems((prev) => prev.filter((problem) => problem._id !== id));
    } catch (err) {
      console.log("delete failed:", err);
    }
  };
  return (
    <div className="space-y-4 ">
      {loading ? (
        <p>Loading problems</p>
      ) : problems.length === 0 ? (
        <p>No problems found</p>
      ) : (
        problems.map((problem) => (
          <div
            key={problem._id}
            className="bg-[#2a2a2a] border border-gray-700 rounded-xl shadow p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">
                {problem.title}
              </h2>
              <p className="text-sm text-gray-400">{problem.difficulty}</p>
            </div>
            <div className="flex gap-4">
              <Link
                to={`/admin/edit/${problem._id}`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteproblem(problem._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminProblemList;
