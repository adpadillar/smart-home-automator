import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../firebase";

type useRefDataParams<T> = {
  path: string;
  filter?: (data: T & { id: string }) => boolean;
  sort?: (a: T & { id: string }, b: T & { id: string }) => number;
  limit?: number;
};

export const useRefData = <T>({
  path,
  filter,
  sort,
  limit = 20,
}: useRefDataParams<T>) => {
  const [data, setData] = useState<Array<T & { id: string }> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(db, path);
    const unsub = onValue(dbRef, (snap) => {
      if (typeof snap.val() == "number") {
        setData([snap.val()]);
        setLoading(false);
        return;
      }

      const data = snap.val() as unknown as Record<string, T>;

      if (!data) {
        setData([]);
        setLoading(false);
        return;
      }
      // use the key as the id
      let result = Object.keys(data).map((key) => ({
        ...data[key],
        id: key,
      })) as Array<T & { id: string }>;

      result = filter ? result.filter(filter) : result;
      result = sort ? result.sort(sort) : result;

      // limit the result to the last limit items
      result = result.slice(-limit);

      setData(result);

      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [path]);

  const getDataOnce = async () => {
    const dbRef = ref(db, path);
    const snap = await get(dbRef);
    const data = snap.val() as unknown as Record<string, T>;
    // use the key as the id
    let result = Object.keys(data).map((key) => ({
      ...data[key],
      id: key,
    })) as Array<T & { id: string }>;

    result = filter ? result.filter(filter) : result;
    result = sort ? result.sort(sort) : result;

    // limit the result to the last limit items
    result = result.slice(-limit);

    return result;
  };

  return [data, loading, getDataOnce] as const;
};
