import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export const useRefData = <T>(
  path: string,
  filter?: (data: T & { id: string }) => boolean,
  sort?: (a: T & { id: string }, b: T & { id: string }) => number,
): [Array<T & { id: string }> | null, boolean] => {
  const [data, setData] = useState<Array<T & { id: string }> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(db, path);
    const unsub = onValue(dbRef, (snap) => {
      const data = snap.val() as unknown as Record<string, T>;
      // use the key as the id
      let result = Object.keys(data).map((key) => ({
        ...data[key],
        id: key,
      })) as Array<T & { id: string }>;

      result = filter ? result.filter(filter) : result;
      result = sort ? result.sort(sort) : result;

      setData(result);

      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [path]);

  return [data, loading];
};
