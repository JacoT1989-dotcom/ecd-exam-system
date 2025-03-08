import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

// Enum matching your updated Prisma schema
enum UserRole {
  USER = "USER",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  SCHOOL_ADMINISTRATOR = "SCHOOL_ADMINISTRATOR",
  PRINCIPAL = "PRINCIPAL",
  PROVINCIAL_EDUCATION_OFFICIAL = "PROVINCIAL_EDUCATION_OFFICIAL",
  NATIONAL_EDUCATION_DEPARTMENTOFFICIAL = "NATIONAL_EDUCATION_DEPARTMENTOFFICIAL",
  EXAM_INVIGILATOR = "EXAM_INVIGILATOR",
  SYSTEM_ADMINISTRATOR = "SYSTEM_ADMINISTRATOR",
  TECHNICAL_SUPPORT_OFFICER = "TECHNICAL_SUPPORT_OFFICER",
  CONTENT_DEVELOPER = "CONTENT_DEVELOPER",
  SECURITY_OFFICER = "SECURITY_OFFICER",
  DATA_PROTECTION_OFFICER = "DATA_PROTECTION_OFFICER",
  QUALITY_ASSURANCE_OFFICER = "QUALITY_ASSURANCE_OFFICER",
  EXAMINATION_BOARD_MEMBER = "EXAMINATION_BOARD_MEMBER",
  PARENT_GUARDIAN = "PARENT_GUARDIAN",
  SUPER_ADMINISTRATOR = "SUPER_ADMINISTRATOR",
}

// Define role-based routing
const roleRoutes: Record<UserRole, string> = {
  [UserRole.USER]: "/register-success",
  [UserRole.STUDENT]: "/students",
  [UserRole.TEACHER]: "/teacher",
  [UserRole.SCHOOL_ADMINISTRATOR]: "/school-admin",
  [UserRole.PRINCIPAL]: "/principal",
  [UserRole.PROVINCIAL_EDUCATION_OFFICIAL]: "/provincial-official",
  [UserRole.NATIONAL_EDUCATION_DEPARTMENTOFFICIAL]: "/national-official",
  [UserRole.EXAM_INVIGILATOR]: "/invigilator",
  [UserRole.SYSTEM_ADMINISTRATOR]: "/system-admin",
  [UserRole.TECHNICAL_SUPPORT_OFFICER]: "/technical-support",
  [UserRole.CONTENT_DEVELOPER]: "/content-developer",
  [UserRole.SECURITY_OFFICER]: "/security",
  [UserRole.DATA_PROTECTION_OFFICER]: "/data-protection",
  [UserRole.QUALITY_ASSURANCE_OFFICER]: "/quality-assurance",
  [UserRole.EXAMINATION_BOARD_MEMBER]: "/exam-board",
  [UserRole.PARENT_GUARDIAN]: "/parent",
  [UserRole.SUPER_ADMINISTRATOR]: "/super-admin",
};

function toUserRole(role: string): UserRole | undefined {
  return Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : undefined;
}

export default async function RoleBasedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) {
    const userRole = toUserRole(user.role);

    if (userRole && userRole in roleRoutes) {
      redirect(roleRoutes[userRole]);
    } else {
      console.warn(`Unrecognized user role: ${user.role}`);
      redirect("/");
    }
  }

  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
