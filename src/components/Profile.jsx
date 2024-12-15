import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Profile({ user }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setUsername(data.username);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, username });

      if (error) throw error;

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <form onSubmit={updateProfile}>
        <input
          type="text"
          placeholder="Enter your new username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="console-input"
        />
        <button type="submit" className="console-button">
          Update Username
        </button>
      </form>
    </div>
  );
}
