import React from "react";
import Journal from "../components/Journal";

export default function JournalPage({ user }) {
  return (
    <div className="page-container">
      <h2>My Journal</h2>
      <Journal user={user} />
    </div>
  );
}
