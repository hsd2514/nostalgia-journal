import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Journal from "./components/Journal";
import CreateEntry from "./components/CreateEntry";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("journal");

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
        <h2>Loading...</h2>
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
      <Navbar
        session={session}
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      <div className="app-container">{renderCurrentView()}</div>
    </>
  );
}
