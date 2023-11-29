import { push, ref, set } from "firebase/database";
import { db } from "../firebase";
import { type Measurement } from "../utils/determineActions";

export const mockDbPush = (path: string) => {
  const pushRandomData = (v: number, sensor: string) => {
    const dbRef = ref(db, path);
    const newDataRef = push(dbRef);

    const measurement: Measurement = {
      sensorId: sensor,
      value: v,
      timestamp: Date.now(),
    };

    return set(newDataRef, measurement);
  };

  return { pushRandomData };
};
