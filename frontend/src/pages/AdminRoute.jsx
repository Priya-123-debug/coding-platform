import react from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  // console.log("AdminRoute debug gg:", { user, isAuthenticated, loading }); // <-- Add this

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role?.toLowerCase() !== "admin") {
    // console.log("Redirecting, not admin or not authenticated");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
