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
import { useCreateGroup } from "../hooks/use-create-group";
import { useGroupFormOptions } from "../hooks/use-group-form-options";
import { GROUP_GENDERS, GROUP_STATUS, WEEK_DAYS } from "../types";
import {
  WEEK_DAY_LABEL,
  formatMinute,
  minuteToTimeInputValue,
  timeInputValueToMinute,
} from "./groups-form-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const groupCreateSchema = z.object({
  locationId: z.string().min(1, "Required"),
  disciplineId: z.string().min(1, "Required"),
  status: z.enum(GROUP_STATUS),
  gender: z.enum(GROUP_GENDERS),
  categoryId: z.string().min(1, "Required"),
  sessionsPerWeek: z.coerce.number().int().min(1).max(14),
  daysOfWeek: z.array(z.enum(WEEK_DAYS)).min(1, "Pick at least one day"),
  startMinute: z.coerce.number().int().min(0).max(1439),
  endMinute: z.coerce.number().int().min(0).max(1439),
  coachId: z.string().optional().or(z.literal("")),
}).refine((payload) => payload.sessionsPerWeek === payload.daysOfWeek.length, {
  path: ["sessionsPerWeek"],
  message: "Sessions per week must match selected days",
});

type GroupCreateFormValues = z.infer<typeof groupCreateSchema>;

export function GroupsCreateForm() {
  const router = useRouter();
  const createGroupMutation = useCreateGroup();
  const { data: options, isLoading: isLoadingOptions, isError: isErrorOptions } = useGroupFormOptions();

  const form = useForm<GroupCreateFormValues>({
    resolver: zodResolver(groupCreateSchema),
    defaultValues: {
      locationId: "",
      disciplineId: "",
      status: "ACTIVE",
      gender: "MALE",
      categoryId: "",
      sessionsPerWeek: 3,
      daysOfWeek: ["MON", "WED", "FRI"],
      startMinute: 1080,
      endMinute: 1170,
      coachId: "",
    },
  });

  const isSubmitting = createGroupMutation.isPending;
  const isFormDisabled = isSubmitting || form.formState.isSubmitting || isLoadingOptions;
  const startMinute = form.watch("startMinute");
  const endMinute = form.watch("endMinute");
  const selectedDays = form.watch("daysOfWeek");

  React.useEffect(() => {
    form.setValue("sessionsPerWeek", selectedDays.length, { shouldValidate: true });
  }, [selectedDays, form]);

  function onSubmit(values: GroupCreateFormValues) {
    form.clearErrors("root");

    if (values.endMinute <= values.startMinute) {
      form.setError("endMinute", { message: "End time must be after start time" });
      return;
    }

    createGroupMutation.mutate(
      {
        locationId: values.locationId,
        disciplineId: values.disciplineId,
        status: values.status,
        gender: values.gender,
        categoryId: values.categoryId,
        sessionsPerWeek: values.sessionsPerWeek,
        daysOfWeek: values.daysOfWeek,
        startMinute: values.startMinute,
        endMinute: values.endMinute,
        coachId: values.coachId?.trim() ? values.coachId.trim() : null,
      },
      {
        onSuccess: () => router.push("/dashboard/groups"),
        onError: (error) => {
          form.setError("root", {
            message: error instanceof Error ? error.message : "Failed to create group",
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

          {isErrorOptions ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              Failed to load options for locations, disciplines, categories or coaches.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Location</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isFormDisabled}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-zinc-950">
                      {(options?.locations ?? []).map((location) => (
                        <SelectItem key={location.id} value={location.id} className="text-white">
                          {location.name}
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
              name="disciplineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Discipline</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isFormDisabled}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select discipline" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-zinc-950">
                      {(options?.disciplines ?? []).map((discipline) => (
                        <SelectItem key={discipline.id} value={discipline.id} className="text-white">
                          {discipline.name}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isFormDisabled}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-zinc-950">
                      {(options?.categories ?? []).map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-white">
                          {category.name}
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
              name="coachId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Coach (optional)</FormLabel>
                  <Select
                    value={field.value || "__none__"}
                    onValueChange={(value) => field.onChange(value === "__none__" ? "" : value)}
                    disabled={isFormDisabled}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-zinc-950">
                      <SelectItem value="__none__" className="text-white">
                        Unassigned
                      </SelectItem>
                      {(options?.coaches ?? []).map((coach) => (
                        <SelectItem key={coach.id} value={coach.id} className="text-white">
                          {coach.name}
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Gender</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isFormDisabled}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-zinc-950">
                      <SelectItem value="MALE" className="text-white">
                        Male
                      </SelectItem>
                      <SelectItem value="FEMALE" className="text-white">
                        Female
                      </SelectItem>
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
                  <Select value={field.value} onValueChange={field.onChange} disabled={isFormDisabled}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-zinc-100 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-zinc-950">
                      <SelectItem value="ACTIVE" className="text-white">
                        Active
                      </SelectItem>
                      <SelectItem value="INACTIVE" className="text-white">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionsPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Sessions per week (auto)</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      readOnly
                      disabled
                      className={cn("border-white/10 bg-black/20 text-zinc-300", "placeholder:text-zinc-600")}
                    />
                  </FormControl>
                  <p className="text-xs text-zinc-500">This value equals selected days.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startMinute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Start time</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      type="time"
                      step={300}
                      value={minuteToTimeInputValue(Number(field.value ?? 0))}
                      onChange={(event) => {
                        const next = timeInputValueToMinute(event.target.value);
                        if (next === null) return;
                        field.onChange(next);
                      }}
                      disabled={isFormDisabled}
                      className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")}
                    />
                  </FormControl>
                  <p className="text-xs text-zinc-500">Time preview: {formatMinute(Number(startMinute || 0))}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endMinute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">End time</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      type="time"
                      step={300}
                      value={minuteToTimeInputValue(Number(field.value ?? 0))}
                      onChange={(event) => {
                        const next = timeInputValueToMinute(event.target.value);
                        if (next === null) return;
                        field.onChange(next);
                      }}
                      disabled={isFormDisabled}
                      className={cn("border-white/10 bg-black/30 text-zinc-100", "placeholder:text-zinc-600")}
                    />
                  </FormControl>
                  <p className="text-xs text-zinc-500">Time preview: {formatMinute(Number(endMinute || 0))}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="daysOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-200">Days of week</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map((day) => {
                    const active = field.value.includes(day);
                    return (
                      <Button
                        key={day}
                        type="button"
                        variant="outline"
                        disabled={isFormDisabled}
                        className={cn(
                          "border-white/15 bg-transparent text-zinc-100 hover:bg-white/10 hover:text-white",
                          active && "border-emerald-500/40 bg-emerald-500/20 text-emerald-100"
                        )}
                        onClick={() => {
                          const next = active
                            ? field.value.filter((value) => value !== day)
                            : [...field.value, day];
                          form.setValue("daysOfWeek", next, { shouldValidate: true });
                          form.setValue("sessionsPerWeek", next.length, { shouldValidate: true });
                        }}
                      >
                        {WEEK_DAY_LABEL[day]}
                      </Button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="text-zinc-300 hover:bg-white/5"
              onClick={() => router.push("/dashboard/groups")}
              disabled={isFormDisabled}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-emerald-500/90 text-black hover:bg-emerald-400"
              disabled={isFormDisabled}
            >
              {isSubmitting ? "Creating..." : "Create group"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
