export type TeacherExam = "KCET" | "NEET" | "JEE Main";
export type TeacherStatus = "Active" | "Inactive";

export type TeacherDraft = {
  name: string;
  email: string;
  phone: string;
  exams: TeacherExam[];
  status: TeacherStatus;
};

export type TeacherActivity = {
  label: string;
  date: string;
};

export type AdminTeacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  exams: TeacherExam[];
  status: TeacherStatus;
  joinedAt: string;
  activity: TeacherActivity[];
};

export const teacherExams: TeacherExam[] = ["KCET", "NEET", "JEE Main"];

async function readApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(result.error ?? "Teacher information could not be loaded.");
  }
  return result;
}

export async function fetchAdminTeachers(accessToken: string): Promise<AdminTeacher[]> {
  const response = await fetch("/api/admin/teachers", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const result = await readApiResponse<{ teachers: AdminTeacher[] }>(response);
  return result.teachers;
}

export async function inviteAdminTeacher(
  accessToken: string,
  draft: TeacherDraft,
): Promise<{ alreadyInvited: boolean; message: string }> {
  const response = await fetch("/api/admin/teachers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(draft),
  });
  return readApiResponse<{ alreadyInvited: boolean; message: string }>(response);
}
