import React from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <div className="main-console">
      <div className="console-header">
        <div className="console-brand">NOSTALGIA-OS v1.0</div>
      </div>
      <div className="auth-container">
        <div className="console-screen">
          <h1>📔 BOOT SEQUENCE</h1>
          <button onClick={signInWithGoogle}>INITIALIZE SYSTEM</button>
        </div>
      </div>
    </div>
  );
}
