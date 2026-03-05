import client from "./client";

export interface ProgressRecord {
  id: string;
  student_id: string;
  lesson_id: string;
  score: number;
  progress_type: string;
}

export interface TotalScore {
  student_id: string;
  total_score: number;
  lessons_completed: number;
}

export const completeLesson = (student_id: string, lesson_id: string, score: number) =>
  client
    .post<ProgressRecord>("/progress/complete", { student_id, lesson_id, score })
    .then((r) => r.data);
    
export const getUserProgress = (user_id: string) =>
  client
    .get<ProgressRecord[]>(`/progress/${user_id}`)
    .then((r) => r.data);

export const getTotalScore = (user_id: string) =>
  client
    .get<TotalScore>(`/progress/total/${user_id}`)
    .then((r) => r.data);

export const markAsRead = (student_id: string, lesson_id: string) =>
  client
    .post<ProgressRecord>("/progress/read", { student_id, lesson_id })
    .then((r) => r.data);