import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
  return auth.signOut();
};
