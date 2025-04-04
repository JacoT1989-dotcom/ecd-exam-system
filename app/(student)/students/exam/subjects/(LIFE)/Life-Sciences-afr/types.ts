// tipes.ts
import { z } from "zod";
import { lewensorientringEksamenSkema } from "./validations";

// Tipe afleiding van die skema
export type LewensorientringEksamenTipe = z.infer<
  typeof lewensorientringEksamenSkema
>;

// Vir vorm indiening (sonder ID en datum wat deur die stelsel ingestel sal word)
export type LewensorientringEksamenVormTipe = Omit<
  LewensorientringEksamenTipe,
  "id" | "datum"
>;

// Meervoudige keuse antwoord opsies
export type MCOpsie = "A" | "B" | "C" | "D";

// Reaksie tipe vir die skep aksie
export type SkepLewensorientringEksamenReaksie = {
  fout?: string;
  sukses?: boolean;
  eksamenId?: string;
};

// Vraag struktuur vir kliënt-kant gebruik
export type LewensorientringVraag = {
  id: string;
  teks: string;
  tipe: "meervoudigeKeuse" | "teks";
  opsies?: string[];
};
