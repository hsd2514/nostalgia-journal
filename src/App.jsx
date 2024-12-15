import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Journal from "./components/Journal";
import CreateEntry from "./components/CreateEntry";
import FloatingStickers from "./components/FloatingStickers";
import MusicPlayer from "./components/MusicPlayer"; // Add this import

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("journal");
  const [theme, setTheme] = useState("theme-retro-green");

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("preferred-theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("preferred-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>LOADING...</h2>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "journal":
        return <Journal user={session.user} />;
      case "profile":
        return <Profile user={session.user} />;
      case "home":
      default:
        return <CreateEntry user={session.user} />;
    }
  };

  return (
    <>
      <div className={`main-console ${theme}`}>
        <FloatingStickers />
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          handleSignOut={() => supabase.auth.signOut()}
        />
        <div className="app-container">{renderCurrentView()}</div>
        {/* Add MusicPlayer opposite to the theme selector */}
        <MusicPlayer autoPlay={true} />
        <div className="theme-selector">
          <button onClick={() => toggleTheme("theme-windows95")}>
            Windows 95
          </button>
          <button onClick={() => toggleTheme("theme-nes")}>NES</button>
          <button onClick={() => toggleTheme("theme-macintosh")}>
            Macintosh
          </button>
          <button onClick={() => toggleTheme("theme-genesis")}>Genesis</button>
        </div>
      </div>
    </>
  );
}
