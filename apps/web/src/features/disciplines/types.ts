export const DISCIPLINE_STATUS = ["ACTIVE", "INACTIVE"] as const;
export type DisciplineStatus = (typeof DISCIPLINE_STATUS)[number];

export type DisciplineRow = {
  id: string;
  name: string;
  icon?: string | null;
  status: DisciplineStatus;
  createdAt: string;
  updatedAt: string;
};

export type DisciplineCreateValues = {
  name: string;
  icon?: string | null;
  status?: DisciplineStatus;
};

export type DisciplineUpdateValues = {
  name?: string;
  icon?: string | null;
  status?: DisciplineStatus;
};
