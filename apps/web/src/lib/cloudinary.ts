export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/avif",
]);

export function validateStudentImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported image format. Use JPG, PNG, WEBP, GIF, HEIC or AVIF.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image is too large. Maximum size is 8MB.");
  }
}

export async function uploadImageToCloudinary(file: File) {
  validateStudentImageFile(file);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars are missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  
  formData.append("folder", "dinosaurios/students");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
      const message = json?.error?.message;
      throw new Error(message || "Cloudinary upload failed.");
    }

    const text = await res.text().catch(() => "");
    throw new Error(text || "Cloudinary upload failed.");
  }

  const json = (await res.json()) as CloudinaryUploadResult;
  return { photoUrl: json.secure_url, photoPublicId: json.public_id };
}
