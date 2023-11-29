import { push, ref, set } from "firebase/database";
import { db } from "../firebase";

export const uploadRefData = (path: string) => {
  const pushData = <T>(data: T) => {
    const dbRef = ref(db, path);
    const newDataRef = push(dbRef);
    return set(newDataRef, data);
  };

  return { pushData };
};
