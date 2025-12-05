import { useApi } from "@/hooks/useApi";

type CreateMeetingPayload = {
  title: string;
};

export const useMeetingsService = () => {
  const { api } = useApi();

  return {
    createMeeting: (payload: CreateMeetingPayload) =>
      api("/meetings", "POST", payload),
  };
};