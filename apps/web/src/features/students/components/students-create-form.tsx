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
import { useCreateStudent } from "../hooks/use-create-student";
import { STUDENT_CATEGORY, STUDENT_STATUS } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const studentCreateSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  dni: z.string().min(8, "Min 8 chars").max(12, "Max 12 chars"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  birthDate: z.string().min(1, "Required"), // yyyy-mm-dd from <input type="date" />
  category: z.enum(STUDENT_CATEGORY),
  status: z.enum(STUDENT_STATUS),
});

type StudentCreateValues = z.infer<typeof studentCreateSchema>;

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

function initials(firstName: string, lastName: string) {
  const a = firstName?.trim()?.[0] ?? "";
  const b = lastName?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "ST";
}

export function StudentCreateForm() {
  const router = useRouter();
  const createStudentMutation = useCreateStudent();

  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = React.useState<string | null>(
    null
  );

  const photoInputRef = React.useRef<HTMLInputElement | null>(null);

  const form = useForm<StudentCreateValues>({
    resolver: zodResolver(studentCreateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      phone: "",
      email: "",
      birthDate: "",
      category: "OPEN",
      status: "ACTIVE",
    },
  });

  const isSubmitting = createStudentMutation.isPending;

  function onPickPhoto(file: File | null) {
    if (!file) {
      setPhotoFile(null);
      setPhotoPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    setPhotoFile(file);

    setPhotoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  async function onSubmit(values: StudentCreateValues) {
    form.clearErrors("root");

    try {
      let photoUrl: string | null = null;
      let photoPublicId: string | null = null;

      // ✅ si el usuario eligió foto, subimos primero a Cloudinary
      if (photoFile) {
        const uploaded = await uploadImageToCloudinary(photoFile);
        photoUrl = uploaded.photoUrl;
        photoPublicId = uploaded.photoPublicId;
      }

      createStudentMutation.mutate(
        { ...values, photoUrl, photoPublicId },
        {
          onSuccess: () => router.push("/dashboard/students"),
          onError: (error) => {
            form.setError("root", {
              message: error instanceof Error ? error.message : "Failed to create student",
            });
          },
        }
      );
    } catch (e) {
      form.setError("root", {
        message: e instanceof Error ? e.message : "Upload failed",
      });
    }
  }

  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");

  return (
    <Card className="relative border-white/10 bg-black/40 p-4 backdrop-blur-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border border-white/10 bg-zinc-950">
              <AvatarImage
                src={photoPreviewUrl ?? undefined}
                alt="Student photo preview"
                className="h-full w-full object-cover"
              />
              <AvatarFallback className="bg-zinc-950 text-sm font-semibold text-white/80">
                {initials(firstName, lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="text-sm font-medium text-white">Student photo</div>
              <p className="text-xs text-white/50">JPG/PNG recommended.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <input
              ref={photoInputRef}
              id="student-photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0] ?? null;
                onPickPhoto(file);
                
                e.currentTarget.value = "";
              }}
            />

            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              onClick={() => photoInputRef.current?.click()}
            >
              Upload photo
            </Button>

            {photoFile ? (
              <Button
                type="button"
                variant="ghost"
                className="text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => onPickPhoto(null)}
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>

        {/* ✅ Separator between photo section and the form */}
        <Separator className="bg-white/10" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {form.formState.errors.root?.message ? (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
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
                        className={cn(
                          "border-white/10 bg-black/30 text-zinc-100",
                          "placeholder:text-zinc-600"
                        )}
                        placeholder="e.g. Frank"
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
                        className={cn(
                          "border-white/10 bg-black/30 text-zinc-100",
                          "placeholder:text-zinc-600"
                        )}
                        placeholder="e.g. Fabian"
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
                        className={cn(
                          "border-white/10 bg-black/30 text-zinc-100",
                          "placeholder:text-zinc-600"
                        )}
                        placeholder="8-12 digits"
                        inputMode="numeric"
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
                        className="border-white/10 bg-black/30 text-zinc-100"
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
                        className={cn(
                          "border-white/10 bg-black/30 text-zinc-100",
                          "placeholder:text-zinc-600"
                        )}
                        placeholder="+51 999 111 222"
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
                        className={cn(
                          "border-white/10 bg-black/30 text-zinc-100",
                          "placeholder:text-zinc-600"
                        )}
                        placeholder="student@email.com"
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

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
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

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
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

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="text-zinc-300 hover:bg-white/5"
                onClick={() => router.push("/dashboard/students")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-emerald-500/90 text-black hover:bg-emerald-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create student"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}