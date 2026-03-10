"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useCreateLocation } from "../hooks/use-create-location";
import { LOCATION_STATUS } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPhotoPicker } from "./location-photo-picker";

const locationCreateSchema = z.object({
  name: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  mapsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  embedUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(LOCATION_STATUS),
});

type LocationCreateFormValues = z.infer<typeof locationCreateSchema>;

export function LocationsCreateForm() {
  const router = useRouter();
  const createLocationMutation = useCreateLocation();
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = React.useState<string | null>(null);

  const form = useForm<LocationCreateFormValues>({
    resolver: zodResolver(locationCreateSchema),
    defaultValues: {
      name: "",
      address: "",
      mapsUrl: "",
      embedUrl: "",
      status: "ACTIVE",
    },
  });

  const isSubmitting = createLocationMutation.isPending;
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
      setPhotoPreviewUrl((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    setPhotoFile(file);
    setPhotoPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  async function onSubmit(values: LocationCreateFormValues) {
    form.clearErrors("root");

    try {
      let photoUrl: string | null = null;
      if (photoFile) {
        const uploaded = await uploadImageToCloudinary(photoFile);
        photoUrl = uploaded.photoUrl;
      }

      createLocationMutation.mutate(
        {
          ...values,
          photoUrl,
          mapsUrl: values.mapsUrl?.trim() ? values.mapsUrl.trim() : null,
          embedUrl: values.embedUrl?.trim() ? values.embedUrl.trim() : null,
        },
        {
          onSuccess: () => router.push("/dashboard/locations"),
          onError: (error) => {
            form.setError("root", {
              message: error instanceof Error ? error.message : "Failed to create location",
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
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {form.formState.errors.root.message}
            </div>
          ) : null}

          <LocationPhotoPicker
            inputId="location-photo"
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
                    <Input
                      {...field}
                      className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")}
                      placeholder="e.g. Sede Principal"
                    />
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
                    <Input
                      {...field}
                      className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")}
                      placeholder="Street, district, city"
                    />
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
                    <Input
                      {...field}
                      className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")}
                      placeholder="Google Maps or Waze share link"
                    />
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
                      placeholder="https://www.google.com/maps/embed?..."
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

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="text-zinc-300 hover:bg-white/5"
              onClick={() => router.push("/dashboard/locations")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-emerald-500/90 text-black hover:bg-emerald-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create location"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
