import React, { useState } from "react";
import axios from "axios";

const AddGroups = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        debut: "",
        labels: "",
        status: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", content: "" });

        if (!formData.name || !formData.description || !formData.image) {
            setMessage({ type: "error", content: "Please fill in all required fields." });
            setLoading(false);
            return;
        }

        try {
            const formPayload = new FormData();
            formPayload.append("name", formData.name);
            formPayload.append("description", formData.description);
            formPayload.append("debut", formData.debut);
            formPayload.append("status", formData.status);
            formPayload.append("image", formData.image);

            formData.labels.split(",").forEach((label) => {
                formPayload.append("labels[]", label.trim());
            });

            const response = await axios.post(
                "https://kpop-api.vercel.app/groups",
                formPayload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMessage({ type: "success", content: "Group added successfully!" });
        } catch (error) {
            setMessage({ type: "error", content: "Failed to add Group!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-300 rounded">
            <input className="border rounded p-2 w-full" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input className="border rounded p-2 w-full" type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
            <input className="border rounded p-2 w-full" type="date" name="debut" value={formData.debut} onChange={handleChange} required />
            <input className="border rounded p-2 w-full" type="text" name="labels" placeholder="Labels (comma-separated)" value={formData.labels} onChange={handleChange} />
            <input className="border rounded p-2 w-full" type="text" name="status" placeholder="Status" value={formData.status} onChange={handleChange} />
            <input className="border rounded p-2 w-full" type="file" name="image" onChange={handleChange} required />
            {formData.image && (
                <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover"
                />
            )}
            <button className="bg-blue-500 text-white rounded p-2" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>

            {message.content && (
                <p className={message.type === "success" ? "text-green-500" : "text-red-500"}>
                    {message.content}
                </p>
            )}
        </form>
    );
};

export default AddGroups;
