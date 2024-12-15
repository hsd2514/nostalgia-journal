import React, { useState, useEffect } from "react";
import { supabase, STORAGE_BUCKET } from "../supabaseClient";

export default function Journal({ user }) {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (user) getEntries();
  }, [user]);

  const getEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*") // Simplified query since image_url is in entries table
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Fetched entries:", data);
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
      setEntries([]);
    }
  };

  const renderEntry = (entry, index) => (
    <div
      key={entry.id}
      id={`entry-${index}`}
      className="journal-page"
      style={{
        display: index === currentPage ? "block" : "none",
      }}
    >
      <div className="journal-content">
        <div className="journal-image-container">
          {entry.image_url && (
            <img
              src={entry.image_url}
              alt="Entry"
              className="journal-image"
              onError={(e) => {
                console.error("Image load error:", e.target.src);
                e.target.style.display = "none";
              }}
            />
          )}
        </div>
        <div className="journal-text">
          <h2>{entry.title}</h2>
          <p>{entry.content}</p>
        </div>
      </div>
      <div className="page-number">
        {index + 1}/{entries.length}
      </div>
    </div>
  );

  const turnPage = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const entryElement = document.querySelector(`#entry-${currentPage}`);
    if (entryElement) {
      entryElement.classList.add("turning");

      setTimeout(() => {
        setCurrentPage((prev) =>
          direction === "next"
            ? Math.min(prev + 1, entries.length - 1)
            : Math.max(prev - 1, 0)
        );
        entryElement.classList.remove("turning");
        setIsAnimating(false);
      }, 600);
    } else {
      setIsAnimating(false);
    }
  };

  return (
    <div className="journal-container">
      <div className="entries-container">
        {entries.length === 0 ? (
          <p className="console-text">
            No entries yet. Create your first memory!
          </p>
        ) : (
          <>
            {entries.map((entry, index) => renderEntry(entry, index))}
            <div className="journal-controls">
              <button
                className="journal-button"
                onClick={() => turnPage("prev")}
                disabled={currentPage === 0}
              >
                ◄ PREVIOUS
              </button>
              <button
                className="journal-button"
                onClick={() => turnPage("next")}
                disabled={currentPage === entries.length - 1}
              >
                NEXT ►
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
