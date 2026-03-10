"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LocationRow } from "../types";
import { LOCATION_STATUS } from "../types";
import { useUpdateLocation } from "../hooks/use-update-location";
import { LocationPhotoPicker } from "./location-photo-picker";

const schema = z.object({
  name: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  mapsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  embedUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(LOCATION_STATUS),
});

type FormValues = z.infer<typeof schema>;

export function LocationEditForm({ location }: { location: LocationRow }) {
  const mutation = useUpdateLocation(location.id);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = React.useState<string | null>(location.photoUrl ?? null);
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: location.name,
      address: location.address,
      mapsUrl: location.mapsUrl ?? "",
      embedUrl: location.embedUrl ?? "",
      status: location.status,
    },
  });

  const isSubmitting = mutation.isPending;
  const locationName = form.watch("name");

  React.useEffect(() => {
    return () => {
      if (photoPreviewUrl && photoPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  function onPickPhoto(file: File | null) {
    if (!file) {
      setPhotoFile(null);
      setRemoveCurrentPhoto(true);
      setPhotoPreviewUrl((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    setRemoveCurrentPhoto(false);
    setPhotoFile(file);
    setPhotoPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  async function onSubmit(values: FormValues) {
    form.clearErrors("root");

    try {
      let photoUrl: string | null | undefined = undefined;

      if (photoFile) {
        const uploaded = await uploadImageToCloudinary(photoFile);
        photoUrl = uploaded.photoUrl;
      } else if (removeCurrentPhoto) {
        photoUrl = null;
      }

      mutation.mutate(
        {
          name: values.name,
          address: values.address,
          mapsUrl: values.mapsUrl?.trim() ? values.mapsUrl.trim() : null,
          embedUrl: values.embedUrl?.trim() ? values.embedUrl.trim() : null,
          status: values.status,
          ...(photoUrl !== undefined ? { photoUrl } : {}),
        },
        {
          onError: (e) => {
            form.setError("root", {
              message: e instanceof Error ? e.message : "Failed to update",
            });
          },
        }
      );
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }

  return (
    <Card className="relative border-white/10 bg-black/40 p-4 backdrop-blur-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {form.formState.errors.root?.message ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {form.formState.errors.root.message}
            </div>
          ) : null}

          <LocationPhotoPicker
            inputId="location-photo-edit"
            name={locationName}
            photoPreviewUrl={photoPreviewUrl}
            onPickPhoto={onPickPhoto}
            onError={(message) => form.setError("root", { message })}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Name</FormLabel>
                  <FormControl>
                    <Input {...field} className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Address</FormLabel>
                  <FormControl>
                    <Input {...field} className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mapsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Maps URL</FormLabel>
                  <FormControl>
                    <Input {...field} className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="embedUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Embed URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-zinc-950">
                      <SelectItem value="ACTIVE" className="text-white hover:bg-white/10 data-highlighted:bg-white/10 data-highlighted:text-white">
                        Active
                      </SelectItem>
                      <SelectItem value="INACTIVE" className="text-white hover:bg-white/10 data-highlighted:bg-white/10 data-highlighted:text-white">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 text-black hover:bg-emerald-400">
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
