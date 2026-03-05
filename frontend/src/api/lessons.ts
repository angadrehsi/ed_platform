import client from "./client";

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  content: string;
}

export const getLessons = () =>
  client.get<Lesson[]>("/lessons/").then((r) => {
    console.log("lessons raw:", r.data);
    return r.data;
  });

export const getLesson = (id: string) =>
  client.get<Lesson>(`/lessons/${id}`).then((r) => r.data);
