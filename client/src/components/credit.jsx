import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import { FiStar } from "react-icons/fi"; // Using a star icon for credits

export default function Credit() {
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_remaining")
        .eq("id", user.id);

      // Log the full response for debugging
      console.log("Credits response:", { data, error });

      if (error) {
        console.error("Supabase credit error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setCredits(data[0].credits_remaining);
      } else {
        setCredits(0);
      }
    };

    fetchCredits();

    // Removed interval fetching, now only fetches on mount/page load
  }, []);

  if (credits === null) return null;

  return (
    <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
      <FiStar className="mr-1 text-yellow-500" />
      Credits: <span className="ml-1 font-bold">{credits}</span>
    </div>
  );
}
