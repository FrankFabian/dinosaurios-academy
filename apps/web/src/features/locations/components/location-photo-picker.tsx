"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateStudentImageFile } from "@/lib/cloudinary";

type LocationPhotoPickerProps = {
  name: string;
  photoPreviewUrl: string | null;
  onPickPhoto: (file: File | null) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  inputId: string;
};

export function LocationPhotoPicker({
  name,
  photoPreviewUrl,
  onPickPhoto,
  onError,
  disabled,
  inputId,
}: LocationPhotoPickerProps) {
  const photoInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60">
        {photoPreviewUrl ? (
          <img src={photoPreviewUrl} alt={`${name || "Location"} photo preview`} className="h-48 w-full object-cover" />
        ) : (
          <div className="flex h-48 w-full items-center justify-center text-zinc-500">
            <MapPin className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="text-sm font-medium text-white">Location photo</div>
          <p className="text-xs text-white/50">JPG, PNG, WEBP, HEIC. Max 8MB. Use a wide image when possible.</p>
        </div>

        <div className="flex items-center gap-2 sm:justify-end">
          <input
            ref={photoInputRef}
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              const file = e.currentTarget.files?.[0] ?? null;
              if (file) {
                try {
                  validateStudentImageFile(file);
                } catch (error) {
                  onError?.(error instanceof Error ? error.message : "Invalid image");
                  e.currentTarget.value = "";
                  return;
                }
              }

              onPickPhoto(file);
              e.currentTarget.value = "";
            }}
          />

          <Button
            type="button"
            variant="outline"
            className="border-white/15 bg-white/5 text-white hover:bg-white/10"
            onClick={() => photoInputRef.current?.click()}
            disabled={disabled}
          >
            Upload photo
          </Button>

          {photoPreviewUrl ? (
            <Button
              type="button"
              variant="ghost"
              className="text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => onPickPhoto(null)}
              disabled={disabled}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
