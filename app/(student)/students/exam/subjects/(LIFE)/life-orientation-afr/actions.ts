"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import {
  LewensorientringEksamenVormTipe,
  SkepLewensorientringEksamenReaksie,
} from "./types";
import { lewensorientringEksamenVormSkema } from "./validations";

/**
 * Bediener aksie om 'n nuwe Lewensoriëntering Eksamen te skep
 * Hierdie aksie is beperk tot studente alleenlik
 */
export async function skepLewensorientringEksamen(
  vormData: LewensorientringEksamenVormTipe,
): Promise<SkepLewensorientringEksamenReaksie> {
  try {
    // Kry huidige sessie om te verifieer dat gebruiker geoutentiseer is
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) {
      return {
        fout: "Jy moet aangemeld wees om 'n eksamen te skep.",
      };
    }

    // Valideer sessie en kry gebruiker
    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
      // Ongeldige sessie
      cookies().delete(lucia.sessionCookieName);
      return {
        fout: "Sessie het verstryk. Meld asseblief weer aan.",
      };
    }

    // Kontroleer of gebruiker 'n student is
    if (user.role !== UserRole.STUDENT) {
      return {
        fout: "Slegs studente kan lewensoriëntering eksamens skep.",
      };
    }

    // Valideer vorm data
    const validatedData = lewensorientringEksamenVormSkema.safeParse({
      ...vormData,
      userId: user.id,
    });

    if (!validatedData.success) {
      // Stuur validasie foute terug
      return {
        fout: "Ongeldige vorm data. Kontroleer asseblief jou antwoorde en probeer weer.",
      };
    }

    // Skep die eksamen in die databasis
    const nuweEksamen = await prisma.lewensorienteringEksamen.create({
      data: validatedData.data,
    });

    // Hervalideer die pad om UI op te dateer
    revalidatePath("/students");

    return {
      sukses: true,
      eksamenId: nuweEksamen.id,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Skep Lewensoriëntering Eksamen fout:", error);
    return {
      fout: "Iets het verkeerd gegaan. Probeer asseblief weer.",
    };
  }
}

/**
 * Bediener aksie om 'n Lewensoriëntering Eksamen op te haal volgens ID
 * Hierdie aksie is beperk tot studente alleenlik
 */
export async function kryLewensorientringEksamen(eksamenId: string) {
  try {
    // Kry huidige sessie om te verifieer dat gebruiker geoutentiseer is
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) {
      return {
        fout: "Jy moet aangemeld wees om 'n eksamen te sien.",
      };
    }

    // Valideer sessie en kry gebruiker
    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
      // Ongeldige sessie
      cookies().delete(lucia.sessionCookieName);
      return {
        fout: "Sessie het verstryk. Meld asseblief weer aan.",
      };
    }

    // Kontroleer of gebruiker 'n student is
    if (user.role !== UserRole.STUDENT) {
      return {
        fout: "Slegs studente kan lewensoriëntering eksamens sien.",
      };
    }

    // Haal die eksamen op van die databasis
    const eksamen = await prisma.lewensorienteringEksamen.findUnique({
      where: {
        id: eksamenId,
        userId: user.id, // Verseker dat die eksamen aan die aanvraende gebruiker behoort
      },
    });

    if (!eksamen) {
      return {
        fout: "Eksamen nie gevind nie of jy het nie toestemming om dit te sien nie.",
      };
    }

    return {
      sukses: true,
      eksamen,
    };
  } catch (error) {
    console.error("Kry Lewensoriëntering Eksamen fout:", error);
    return {
      fout: "Iets het verkeerd gegaan. Probeer asseblief weer.",
    };
  }
}
