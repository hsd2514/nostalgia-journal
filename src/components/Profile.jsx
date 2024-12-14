import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Profile({ user }) {
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) setDisplayName(data.display_name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <form onSubmit={updateProfile}>
        <input
          type="text"
          value={displayName || ""}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
