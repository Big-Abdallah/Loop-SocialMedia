import { useState, useRef } from "react";
import uploadProfilePhoto from "../../Api/Auth/UploadProfilePhoto";

export default function EditProfilePhoto({ currentPhoto, onUploaded }) {
    const [preview, setPreview] = useState(currentPhoto);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("photo", file);

            const res = await uploadProfilePhoto(formData);

            if (res.success === false) {
                setError(res.message || "حصل مشكلة في رفع الصورة");
            } else {
                onUploaded?.(res.photo || res.user?.photo);
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("حصل مشكلة في رفع الصورة");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
            >
                <img
                    src={preview || "https://i.pravatar.cc/150?img=12"}
                    alt="Profile"
                    className="w-40 h-40 md:w-50 md:h-50 rounded-full object-cover border-4"
                    style={{ borderColor: "var(--color-bg-card)" }}
                />
                <div className="absolute inset-0  rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="text-white  text-xs font-medium">Change</span>
                </div>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-upload"
            >
                {uploading ? "جاري الرفع..." : "Change Profile Photo"}
            </button>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}