import React, { useState } from "react";
import { supabase, STORAGE_BUCKET } from "../supabaseClient";

export default function CreateEntry({ user }) {
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    try {
      let imageUrl = null;

      // Upload image if one is selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        console.log("Uploading image:", { fileName, filePath });

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
        console.log("Image uploaded, URL:", imageUrl);
      }

      // Create entry with optional image URL
      const { error: entryError } = await supabase.from("entries").insert([
        {
          user_id: user.id,
          title: newEntry.title,
          content: newEntry.content,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        },
      ]);

      if (entryError) throw entryError;

      setNewEntry({ title: "", content: "" });
      setImageFile(null);
      alert("Entry saved successfully!");
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Error saving entry");
    }
  };

  return (
    <div className="create-entry-page">
      <div className="game-console">
        <div className="console-screen">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="ENTER TITLE..."
              value={newEntry.title}
              onChange={(e) =>
                setNewEntry({ ...newEntry, title: e.target.value })
              }
              className="console-input"
              maxLength={40}
            />
            <textarea
              placeholder="WRITE YOUR STORY..."
              value={newEntry.content}
              onChange={(e) =>
                setNewEntry({ ...newEntry, content: e.target.value })
              }
              className="console-textarea"
              rows={10}
            />
          </form>
        </div>

        <div className="console-controls">
          <div className="action-buttons">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="file-input"
            />
            <div>
              <button
                className="action-button"
                data-type="img"
                onClick={() => document.getElementById("file-input").click()}
              >
                +
              </button>
              <div className="button-label">IMG</div>
            </div>
            <div>
              <button
                className="action-button"
                data-type="save"
                onClick={handleSubmit}
              >
                ✓
              </button>
              <div className="button-label">SAVE</div>
            </div>
            <div>
              <button
                className="action-button"
                data-type="clear"
                onClick={() => {
                  setNewEntry({ title: "", content: "" });
                  setImageFile(null);
                }}
              >
                ×
              </button>
              <div className="button-label">CLEAR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
