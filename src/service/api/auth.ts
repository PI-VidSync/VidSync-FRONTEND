import { getIdToken } from "../firebase/token";

const token = await getIdToken();

const res = await fetch("https://tu-render.com/api/auth/verify-token", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});