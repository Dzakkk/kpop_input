import React, { useEffect, useState } from "react";
import axios from "axios";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", content: "" });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("https://kpop-api.vercel.app/groups", {
          headers: {
            // Anda bisa menambahkan header lain di sini jika diperlukan
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setMessage({ type: "error", content: "Failed to fetch groups!" });
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []); // Empty array means this effect runs only once after the first render

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Group List</h1>
      {message.content && (
        <p className={message.type === "error" ? "text-red-500" : "text-green-500"}>
          {message.content}
        </p>
      )}
      <ul>
        {groups.map((group) => (
          <li key={group._id}>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <p>Debut: {new Date(group.debut).toLocaleDateString()}</p>
            <p>Status: {group.status}</p>
            <img src={group.imageURL} alt={group.name} style={{ width: "100px" }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Groups;
