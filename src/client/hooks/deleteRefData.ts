import { ref, remove } from "firebase/database";
import { db } from "../firebase";

export const deleteRefData = () => {
  const deleteData = (path: string) => {
    const dbRef = ref(db, path);
    return remove(dbRef);
  };

  return { deleteData };
};
