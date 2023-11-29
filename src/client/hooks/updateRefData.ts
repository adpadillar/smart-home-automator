import { ref, update } from "firebase/database";
import { db } from "../firebase";

export const updateRefData = (path: string) => {
  const updateData = <T extends Record<string, unknown>>(newData: T) => {
    const dbRef = ref(db, path);
    return update(dbRef, newData);
  };

  return { updateData };
};
