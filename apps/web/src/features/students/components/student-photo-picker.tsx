"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { validateStudentImageFile } from "@/lib/cloudinary";

type StudentPhotoPickerProps = {
  firstName: string;
  lastName: string;
  photoPreviewUrl: string | null;
  onPickPhoto: (file: File | null) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  inputId: string;
};

function initials(firstName: string, lastName: string) {
  const a = firstName?.trim()?.[0] ?? "";
  const b = lastName?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "ST";
}

export function StudentPhotoPicker({
  firstName,
  lastName,
  photoPreviewUrl,
  onPickPhoto,
  onError,
  disabled,
  inputId,
}: StudentPhotoPickerProps) {
  const photoInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border border-white/10 bg-zinc-950">
          <AvatarImage src={photoPreviewUrl ?? undefined} alt="Student photo preview" className="h-full w-full object-cover" />
          <AvatarFallback className="bg-zinc-950 text-sm font-semibold text-white/80">
            {initials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="text-sm font-medium text-white">Student photo</div>
          <p className="text-xs text-white/50">JPG, PNG, WEBP, HEIC. Max 8MB.</p>
        </div>
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
  );
}
