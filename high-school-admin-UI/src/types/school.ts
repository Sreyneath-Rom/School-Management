// src/types/school.ts
export type GradeScale = {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  point: number;
  description: string;
  passing: boolean;
};

export type SchoolFormState = {
  name: string;
  schoolCode: string;
  logoUrl: string;
  motto: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  academicYear: string;
  academicTerm: string;
  language: string;
  timeZone: string;
  dateFormat: string;
};