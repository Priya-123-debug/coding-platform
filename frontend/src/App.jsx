import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Mainpage from "./pages/Mainpage";
import CodeEditor from "./pages/CodeEditor";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminProblemList from "./pages/admin/AdminProblemList";
import ProblemForm from "./pages/admin/ProblemForm";
import Editpages from "./pages/admin/Editpages";

import AdminRoute from "./pages/AdminRoute";
import { checkAuth } from "./store/authSlice";

function App() {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // 🔄 Global loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* 🌍 Public landing page */}
      <Route path="/mainpage" element={<Mainpage />} />

      {/* 🏠 Root route (auth-based redirect) */}
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

     
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" /> : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/" /> : <Signup />
        }
      />

     
      <Route path="/problem/:id" element={<CodeEditor />} />

     
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
