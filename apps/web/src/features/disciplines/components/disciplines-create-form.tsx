"use client";

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
import { useCreateDiscipline } from "../hooks/use-create-discipline";
import { DISCIPLINE_STATUS } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const disciplineCreateSchema = z.object({
  name: z.string().min(1, "Required"),
  icon: z.string().optional().or(z.literal("")),
  status: z.enum(DISCIPLINE_STATUS),
});

type DisciplineCreateFormValues = z.infer<typeof disciplineCreateSchema>;

export function DisciplinesCreateForm() {
  const router = useRouter();
  const createDisciplineMutation = useCreateDiscipline();
  const form = useForm<DisciplineCreateFormValues>({
    resolver: zodResolver(disciplineCreateSchema),
    defaultValues: {
      name: "",
      icon: "",
      status: "ACTIVE",
    },
  });

  const isSubmitting = createDisciplineMutation.isPending;
  const isFormDisabled = isSubmitting || form.formState.isSubmitting;

  function onSubmit(values: DisciplineCreateFormValues) {
    form.clearErrors("root");

    createDisciplineMutation.mutate(
      {
        name: values.name.trim(),
        icon: values.icon?.trim() ? values.icon.trim() : null,
        status: values.status,
      },
      {
        onSuccess: () => router.push("/dashboard/disciplines"),
        onError: (error) => {
          form.setError("root", {
            message: error instanceof Error ? error.message : "Failed to create discipline",
          });
        },
      }
    );
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
                      disabled={isFormDisabled}
                      className={cn(
                        "border-white/10 bg-black/30 text-zinc-100",
                        "placeholder:text-zinc-600"
                      )}
                      placeholder="e.g. Basketball"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Icon (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isFormDisabled}
                      className={cn(
                        "border-white/10 bg-black/30 text-zinc-100",
                        "placeholder:text-zinc-600"
                      )}
                      placeholder="emoji or short text, e.g. 🏐"
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
                  <Select value={field.value} onValueChange={field.onChange} disabled={isFormDisabled}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-zinc-950">
                      <SelectItem
                        value="ACTIVE"
                        className="text-white hover:bg-white/10 data-highlighted:bg-white/10 data-highlighted:text-white"
                      >
                        Active
                      </SelectItem>
                      <SelectItem
                        value="INACTIVE"
                        className="text-white hover:bg-white/10 data-highlighted:bg-white/10 data-highlighted:text-white"
                      >
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
              onClick={() => router.push("/dashboard/disciplines")}
              disabled={isFormDisabled}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-emerald-500/90 text-black hover:bg-emerald-400"
              disabled={isFormDisabled}
            >
              {isSubmitting ? "Creating..." : "Create discipline"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
