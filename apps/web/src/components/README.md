# Atomic Design Structure

- **atoms/**: smallest UI building blocks (Button, Input, Badge wrappers, icons)
- **molecules/**: composed atoms (LabeledInput, SearchBar, FieldRow)
- **organisms/**: complex sections (DataTable, AttendanceList, FiltersPanel)
- **templates/**: page layouts (DashboardLayout, AuthLayout)
- **pages/**: page-specific UI blocks for Next.js routes (thin, orchestration only)

> Rule: Prefer shadcn/ui primitives in `@/components/ui` and wrap them into atoms/molecules when needed.
