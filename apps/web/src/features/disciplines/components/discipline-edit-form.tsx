"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DisciplineRow } from "../types";
import { DISCIPLINE_STATUS } from "../types";
import { useUpdateDiscipline } from "../hooks/use-update-discipline";

const schema = z.object({
  name: z.string().min(1, "Required"),
  icon: z.string().optional().or(z.literal("")),
  status: z.enum(DISCIPLINE_STATUS),
});

type FormValues = z.infer<typeof schema>;

export function DisciplineEditForm({ discipline }: { discipline: DisciplineRow }) {
  const mutation = useUpdateDiscipline(discipline.id);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: discipline.name,
      icon: discipline.icon ?? "",
      status: discipline.status,
    },
  });

  const isSubmitting = mutation.isPending;
  const isFormDisabled = isSubmitting || form.formState.isSubmitting;

  function onSubmit(values: FormValues) {
    form.clearErrors("root");

    mutation.mutate(
      {
        name: values.name.trim(),
        icon: values.icon?.trim() ? values.icon.trim() : null,
        status: values.status,
      },
      {
        onError: (e) => {
          form.setError("root", {
            message: e instanceof Error ? e.message : "Failed to update",
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
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
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
                      className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")}
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

          <div className="flex items-center justify-end gap-2">
            <Button
              type="submit"
              disabled={isFormDisabled}
              className="bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
