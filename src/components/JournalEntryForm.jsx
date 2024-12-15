import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function JournalEntryForm({ user }) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!content.trim()) {
      alert("Please enter some content.");
      return;
    }

    let imageUrl = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from("entry-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicData, error: urlError } = supabase.storage
          .from("entry-images")
          .getPublicUrl(filePath);

        if (urlError) throw urlError;

        imageUrl = publicData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("entries") // Consistent table name
        .insert([{ user_id: user.id, content, image_url: imageUrl }]);

      if (insertError) throw insertError;

      setContent("");
      setImageFile(null);
      alert("Entry saved successfully");
    } catch (error) {
      console.error("Error saving entry:", error.message);
      alert("Error saving entry");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your journal entry..."
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <button type="submit">Add Entry</button>
    </form>
  );
}
