"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

import type { StudentRow } from "../types";
import { STUDENT_CATEGORY, STUDENT_STATUS } from "../types";
import { useUpdateStudent } from "../hooks/use-update-student";
import { StudentQrDialog } from "./students-qr-dialog";
import { StudentPhotoPicker } from "./student-photo-picker";

const schema = z.object({
  firstName: z.string().min(1, "Required").optional(),
  lastName: z.string().min(1, "Required").optional(),
  dni: z.string().min(8, "Min 8 chars").max(12, "Max 12 chars").optional(),
  birthDate: z.string().optional(),
  category: z.enum(STUDENT_CATEGORY).optional(),
  status: z.enum(STUDENT_STATUS).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Role = "ADMIN" | "STAFF" | "COACH" | "STUDENT";

const CATEGORY_LABEL: Record<(typeof STUDENT_CATEGORY)[number], string> = {
  PRE_MINI: "Pre-mini",
  MINI: "Mini",
  U13: "U13",
  U15: "U15",
  U17: "U17",
  U19: "U19",
  OPEN: "Open",
};

const STATUS_LABEL: Record<(typeof STUDENT_STATUS)[number], string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export function StudentEditForm({ student }: { student: StudentRow }) {
  // TODO: saca esto del session/role real
  const role: Role = "ADMIN";

  const canEditAll = role === "ADMIN" || role === "STAFF";
  const mutation = useUpdateStudent(student.id);
  const [qrOpen, setQrOpen] = React.useState(false);

  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = React.useState<string | null>(student.photoUrl ?? null);
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: student.firstName,
      lastName: student.lastName,
      dni: student.dni,
      birthDate: student.birthDate,
      category: student.category,
      status: student.status,
      email: student.email ?? "",
      phone: student.phone ?? "",
    },
  });

  const isSubmitting = mutation.isPending;

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
      let photoPublicId: string | null | undefined = undefined;

      if (canEditAll) {
        if (photoFile) {
          const uploaded = await uploadImageToCloudinary(photoFile);
          photoUrl = uploaded.photoUrl;
          photoPublicId = uploaded.photoPublicId;
        } else if (removeCurrentPhoto) {
          photoUrl = null;
          photoPublicId = null;
        }
      }

      const payload = canEditAll
        ? {
            firstName: values.firstName,
            lastName: values.lastName,
            dni: values.dni,
            birthDate: values.birthDate,
            category: values.category,
            status: values.status,
            email: values.email ? values.email : null,
            phone: values.phone ? values.phone : null,
            ...(photoUrl !== undefined ? { photoUrl } : {}),
            ...(photoPublicId !== undefined ? { photoPublicId } : {}),
          }
        : {
            email: values.email ? values.email : null,
            phone: values.phone ? values.phone : null,
          };

      mutation.mutate(payload, {
        onError: (e) => {
          form.setError("root", {
            message: e instanceof Error ? e.message : "Failed to update",
          });
        },
      });
    } catch (e) {
      form.setError("root", {
        message: e instanceof Error ? e.message : "Upload failed",
      });
    }
  }

  const firstName = form.watch("firstName") ?? "";
  const lastName = form.watch("lastName") ?? "";

  return (
    <Card className="relative border-white/10 bg-black/40 p-4 backdrop-blur-md">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-white">Edit student</div>
            <div className="text-sm text-white/60">Update profile info and view QR.</div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-white/15 bg-transparent text-white hover:bg-white/10"
            onClick={() => setQrOpen(true)}
          >
            View QR
          </Button>
        </div>

        <StudentQrDialog
          student={{ fullName: student.fullName, qrCodeValue: student.qrCodeValue }}
          open={qrOpen}
          onOpenChange={setQrOpen}
        />

        <StudentPhotoPicker
          inputId="student-photo-edit"
          firstName={firstName}
          lastName={lastName}
          photoPreviewUrl={photoPreviewUrl}
          onPickPhoto={onPickPhoto}
          onError={(message) => form.setError("root", { message })}
          disabled={!canEditAll || isSubmitting}
        />

        <Separator className="bg-white/10" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {form.formState.errors.root?.message ? (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {form.formState.errors.root.message}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">First name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canEditAll}
                        className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600", !canEditAll && "opacity-70")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Last name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canEditAll}
                        className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600", !canEditAll && "opacity-70")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">DNI</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canEditAll}
                        className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600", !canEditAll && "opacity-70")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Birth date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={!canEditAll}
                        className={cn("border-white/10 bg-black/30 text-zinc-100", !canEditAll && "opacity-70")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Phone</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Email</FormLabel>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={!canEditAll}>
                      <FormControl>
                        <SelectTrigger className={cn("w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0", !canEditAll && "opacity-70")}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/10 bg-zinc-950">
                        {STUDENT_CATEGORY.map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                            className="text-white hover:bg-white/10 data-highlighted:bg-white/10 data-highlighted:text-white"
                          >
                            {CATEGORY_LABEL[cat]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select value={field.value} onValueChange={field.onChange} disabled={!canEditAll}>
                      <FormControl>
                        <SelectTrigger className={cn("w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0", !canEditAll && "opacity-70")}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/10 bg-zinc-950">
                        {STUDENT_STATUS.map((st) => (
                          <SelectItem
                            key={st}
                            value={st}
                            className="text-white hover:bg-white/10 data-highlighted:bg-white/10 data-highlighted:text-white"
                          >
                            {STATUS_LABEL[st]}
                          </SelectItem>
                        ))}
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
      </div>
    </Card>
  );
}
