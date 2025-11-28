import { request } from "@/hooks/useApi";

export type CreateMeetingPayload = {
  title: string;
};

export const createMeeting = async (payload: CreateMeetingPayload) => {
  // POST /meetings -> returns { ok: true, meeting: { meetingId, id, ... } }
  return request("/meetings", "POST", payload);
};