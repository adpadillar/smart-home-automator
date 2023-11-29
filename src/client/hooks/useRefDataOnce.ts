import { ref, get } from "firebase/database";
import { db } from "../firebase";

type useRefDataParams<T> = {
  path: string;
  filter?: (data: T & { id: string }) => boolean;
  sort?: (a: T & { id: string }, b: T & { id: string }) => number;
  limit?: number;
};

export const useRefDataOnce = <T>({
  path,
  filter,
  sort,
  limit = 20,
}: useRefDataParams<T>) => {
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

  return { getDataOnce } as const;
};
