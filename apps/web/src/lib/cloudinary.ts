export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function uploadImageToCloudinary(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars are missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // opcional: organizar en folder
  formData.append("folder", "dinosaurios/students");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Cloudinary upload failed.");
  }

  const json = (await res.json()) as CloudinaryUploadResult;
  return { photoUrl: json.secure_url, photoPublicId: json.public_id };
}