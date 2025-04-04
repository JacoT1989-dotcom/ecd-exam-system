// validasie.ts
import { z } from "zod";

// Meervoudige keuse opsies
const mcOpsies = ["A", "B", "C", "D"] as const;

// Validasie skema vir Lewensoriëntering Eksamen
export const lewensorientringEksamenSkema = z.object({
  id: z.string().uuid().optional(), // Opsioneel omdat dit outomaties gegenereer sal word
  titel: z
    .string()
    .min(5, { message: "Titel moet ten minste 5 karakters wees" })
    .max(100),
  graad: z
    .number()
    .int()
    .min(8, { message: "Graad moet ten minste 8 wees" })
    .max(12),
  datum: z.date().optional(), // Opsioneel omdat dit na die huidige datum sal verstek

  // Meervoudige keuse vrae (1-25)
  vraag1: z.enum(mcOpsies, {
    errorMap: () => ({ message: "Kies asseblief opsie A, B, C, of D" }),
  }),
  vraag2: z.enum(mcOpsies),
  vraag3: z.enum(mcOpsies),
  vraag4: z.enum(mcOpsies),
  vraag5: z.enum(mcOpsies),
  vraag6: z.enum(mcOpsies),
  vraag7: z.enum(mcOpsies),
  vraag8: z.enum(mcOpsies),
  vraag9: z.enum(mcOpsies),
  vraag10: z.enum(mcOpsies),
  vraag11: z.enum(mcOpsies),
  vraag12: z.enum(mcOpsies),
  vraag13: z.enum(mcOpsies),
  vraag14: z.enum(mcOpsies),
  vraag15: z.enum(mcOpsies),
  vraag16: z.enum(mcOpsies),
  vraag17: z.enum(mcOpsies),
  vraag18: z.enum(mcOpsies),
  vraag19: z.enum(mcOpsies),
  vraag20: z.enum(mcOpsies),
  vraag21: z.enum(mcOpsies),
  vraag22: z.enum(mcOpsies),
  vraag23: z.enum(mcOpsies),
  vraag24: z.enum(mcOpsies),
  vraag25: z.enum(mcOpsies),

  // Teks-gebaseerde vrae (26-50)
  vraag26: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag27: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag28: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag29: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag30: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag31: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag32: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag33: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag34: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag35: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag36: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag37: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag38: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag39: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag40: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag41: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag42: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag43: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag44: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag45: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag46: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag47: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag48: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag49: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),
  vraag50: z
    .string()
    .min(1, { message: "Antwoord kan nie leeg wees nie" })
    .max(500),

  userId: z.string(),
});

// Vir vorm indiening (sonder ID en datum wat deur die stelsel ingestel sal word)
export const lewensorientringEksamenVormSkema =
  lewensorientringEksamenSkema.omit({
    id: true,
    datum: true,
  });

// Hulpfunksie om verstek waardes vir die vorm te genereer
export const getVerstekLewensorientringEksamenWaardes = () => {
  return {
    titel: "",
    graad: 10,
    vraag1: undefined,
    vraag2: undefined,
    vraag3: undefined,
    vraag4: undefined,
    vraag5: undefined,
    vraag6: undefined,
    vraag7: undefined,
    vraag8: undefined,
    vraag9: undefined,
    vraag10: undefined,
    vraag11: undefined,
    vraag12: undefined,
    vraag13: undefined,
    vraag14: undefined,
    vraag15: undefined,
    vraag16: undefined,
    vraag17: undefined,
    vraag18: undefined,
    vraag19: undefined,
    vraag20: undefined,
    vraag21: undefined,
    vraag22: undefined,
    vraag23: undefined,
    vraag24: undefined,
    vraag25: undefined,
    vraag26: "",
    vraag27: "",
    vraag28: "",
    vraag29: "",
    vraag30: "",
    vraag31: "",
    vraag32: "",
    vraag33: "",
    vraag34: "",
    vraag35: "",
    vraag36: "",
    vraag37: "",
    vraag38: "",
    vraag39: "",
    vraag40: "",
    vraag41: "",
    vraag42: "",
    vraag43: "",
    vraag44: "",
    vraag45: "",
    vraag46: "",
    vraag47: "",
    vraag48: "",
    vraag49: "",
    vraag50: "",
    userId: "",
  };
};
