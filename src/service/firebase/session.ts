import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Sesión activa:", user.email);
  } else {
    console.log("No hay sesión");
  }
});