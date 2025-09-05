import { useState } from "react";
import { addEntry } from "../utils/journal";

type CreateEntryModalProps = {
    date: Date;
    onClose: () => void;
};

export default function CreateEntryModal({ date, onClose }: CreateEntryModalProps) {
    const [imageUrl, setImageUrl] = useState("");
    const [rating, setRating] = useState<number | "">("");
    const [categories, setCategories] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = async (file: File) => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=d954daf1e531577ea4da57a23a9dc8d9`,
                { method: "POST", body: formData }
            );
            const data = await res.json();
            setImageUrl(data.data.image.url);
            console.log(data.data.image.url)
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        if (!imageUrl) {
            alert("Please upload an image first");
            return;
        }
        if (!rating || rating < 0 || rating > 5) {
            alert("Rating must be between 0 and 5");
            return;
        }

        const newEntry = {
            id: "",
            date: date.toLocaleDateString("en-US"),
            imageUrl,
            rating: Number(rating),
            categories: categories.split(",").map((c) => c.trim()),
            description,
        };

        addEntry(new Map(), newEntry);
        onClose();
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-semibold mb-4">Create Journal Entry</h2>

                {/* Image Upload */}
                <div className="mb-3">
                    <label className="block mb-1">Upload Image</label>
                    <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e: any) => {
                                const file = e.target.files[0];
                                if (file) handleFileSelect(file); // auto upload
                            };
                            input.click();
                        }}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>

                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="preview"
                            className="mt-3 w-32 h-32 object-cover rounded-lg"
                        />
                    )}
                </div>

                {/* Rating */}
                <div className="mb-3">
                    <label className="block mb-1">Rating (1–5, decimals allowed)</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border rounded-md p-2 w-full"
                    />
                </div>

                {/* Categories */}
                <div className="mb-3">
                    <label className="block mb-1">Categories (comma separated)</label>
                    <input
                        type="text"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        className="border rounded-md p-2 w-full"
                    />
                </div>

                {/* Date */}
                <div className="mb-3">
                    <label className="block mb-1">Date</label>
                    <input
                        type="date"
                        value={date.toISOString().split("T")[0]}
                        readOnly
                        className="border rounded-md p-2 w-full bg-gray-100"
                    />
                </div>

                {/* Description */}
                <div className="mb-3">
                    <label className="block mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-md p-2 w-full"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
