import React from "react";

function AppLoader({ status }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-orange-500 px-4">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-white text-lg font-semibold mb-2">
          {status === "slow" ? "Waking up the server…" : "Loading…"}
        </h2>

        {status === "slow" && (
          <p className="text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
            This app runs on free hosting, which spins down when idle.
            First load can take up to a minute — thanks for your patience!
          </p>
        )}
      </div>
    </div>
  );
}

export default AppLoader;