import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function JournalEntriesList({ user }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else setEntries(data);
    };
    fetchEntries();
  }, [user.id]);

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id}>
          <p>{entry.content}</p>
          {entry.image_url && (
            <img
              src={`${
                import.meta.env.VITE_SUPABASE_URL
              }/storage/v1/object/public/${entry.image_url}`}
              alt="Journal Entry"
            />
          )}
        </div>
      ))}
    </div>
  );
}
