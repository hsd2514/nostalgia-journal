import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home({ user }) {
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [image, setImage] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("entry-images")
        .upload(filePath, file);

      if (!uploadError) setImage(filePath);
    }
  };

  const createEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    try {
      const { data: entry, error: entryError } = await supabase
        .from("entries")
        .insert([
          {
            user_id: user.id,
            title: newEntry.title,
            content: newEntry.content,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (entryError) throw entryError;

      if (image) {
        const { error: imageError } = await supabase
          .from("entry_images")
          .insert([
            {
              entry_id: entry.id,
              image_url: image,
            },
          ]);

        if (imageError) throw imageError;
      }

      setNewEntry({ title: "", content: "" });
      setImage(null);
      alert("Entry saved successfully!");
    } catch (error) {
      alert("Error saving entry");
    }
  };

  return (
    <div className="create-entry-page">
      <h2>Create New Memory</h2>
      <form onSubmit={createEntry} className="create-entry-form">
        <input
          type="text"
          placeholder="Title of your memory..."
          value={newEntry.title}
          onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
        />
        <textarea
          placeholder="Write your memory here..."
          value={newEntry.content}
          onChange={(e) =>
            setNewEntry({ ...newEntry, content: e.target.value })
          }
          rows={10}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: "10px" }}
        />
        {image && <p className="file-selected">✓ Image selected</p>}
        <button type="submit">Save Memory</button>
      </form>
    </div>
  );
}
