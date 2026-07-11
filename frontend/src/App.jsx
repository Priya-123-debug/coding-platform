import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Mainpage from "./pages/Mainpage";
import CodeEditor from "./pages/CodeEditor";
import Profile from "./pages/Profile";
import Submissions from "./pages/Submissions";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminProblemList from "./pages/admin/AdminProblemList";
import ProblemForm from "./pages/admin/ProblemForm";
import Editpages from "./pages/admin/Editpages";
import LearningNotebook from "./pages/LearningNotebook";

import AdminRoute from "./pages/AdminRoute";
import { checkAuth } from "./store/authSlice";
import AppLoader from "./pages/AppLoader";


function App() {
  // ── ALL HOOKS FIRST, UNCONDITIONALLY ──
  const [serverStatus, setServerStatus] = useState("checking");
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const slowTimer = setTimeout(() => setServerStatus("slow"), 3000);

 const pingServer = async () => {
  try {
    await axios.get("https://coding-platform-t3or.onrender.com/health", {
      withCredentials: false,
    });
  } catch (err) {
    // even a 401/404 means the server responded — it's awake
  } finally {
    clearTimeout(slowTimer);
    setServerStatus("ready");
  }
};

    pingServer();

    return () => clearTimeout(slowTimer);
  }, []);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // ── NOW conditional returns are safe, since every hook above always ran ──
  if (serverStatus !== "ready") {
    return <AppLoader status={serverStatus} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/mainpage" element={<Mainpage />} />

      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/mainpage" />
          ) : user?.role === "admin" ? (
            <Navigate to="/admin" />
          ) : (
            <Homepage />
          )
        }
      />

      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
      <Route path="/problem/:id" element={<CodeEditor />} />

      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/submissions" element={isAuthenticated ? <Submissions /> : <Navigate to="/login" />} />
      <Route path="/learning-notes" element={<LearningNotebook />} />
      <Route path="/notebook" element={isAuthenticated ? <LearningNotebook /> : <Navigate to="/login" />} />

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminProblemList />} />
        <Route path="create" element={<ProblemForm />} />
        <Route path="edit/:id" element={<Editpages />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;