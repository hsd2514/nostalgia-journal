import React from "react";

const Navbar = ({ currentView, setCurrentView, handleSignOut }) => {
  return (
    <div className="console-header">
      <div className="console-brand">NOSTALGIA-OS v1.0</div>
      <div className="console-nav">
        <button
          className={currentView === "home" ? "active" : ""}
          onClick={() => setCurrentView("home")}
        >
          NEW
        </button>
        <button
          className={currentView === "journal" ? "active" : ""}
          onClick={() => setCurrentView("journal")}
        >
          VIEW
        </button>
        <button
          className={currentView === "profile" ? "active" : ""}
          onClick={() => setCurrentView("profile")}
        >
          PROFILE
        </button>
        <button onClick={handleSignOut}>EXIT</button>
      </div>
    </div>
  );
};

export default Navbar;
