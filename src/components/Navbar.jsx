import React from "react";
import { supabase } from "../supabaseClient";

export default function Navbar({ session, currentView, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">📔 Nostalgia Journal</div>
      {session && (
        <div className="nav-links">
          <button
            className={`nav-button ${currentView === "home" ? "active" : ""}`}
            onClick={() => onNavigate("home")}
          >
            New Entry
          </button>
          <button
            className={`nav-button ${
              currentView === "journal" ? "active" : ""
            }`}
            onClick={() => onNavigate("journal")}
          >
            My Journal
          </button>
          <button
            className={`nav-button ${
              currentView === "profile" ? "active" : ""
            }`}
            onClick={() => onNavigate("profile")}
          >
            Profile
          </button>
          <button
            className="nav-button"
            onClick={() => supabase.auth.signOut()}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
