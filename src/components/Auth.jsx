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
    <div className="auth-container">
      <div className="auth-box">
        <h1>📔 Nostalgia Journal</h1>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </div>
  );
}
