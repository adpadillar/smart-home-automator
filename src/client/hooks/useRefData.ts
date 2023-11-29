import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export const useRefData = <T>(
  path: string,
): [Array<T & { id: string }> | null, boolean] => {
  const [data, setData] = useState<Array<T & { id: string }> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(db, path);
    onValue(dbRef, (snap) => {
      const data = snap.val() as unknown as Record<string, T>;
      // use the key as the id
      const result = Object.keys(data).map((key) => ({
        ...data[key],
        id: key,
      })) as Array<T & { id: string }>;

      setData(result);
      setLoading(false);
    });
  }, [path]);

  return [data, loading];
};
