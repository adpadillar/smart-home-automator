import { Actuator } from "~/components/AddAutomation";

type Action = {
  sensorId: string;
  actuatorId: string;
  trigger: "lt" | "gt" | "on" | "off";
  newState: {
    enabled: boolean;
    metadata:
      | undefined
      | {
          value: number;
        };
    stopAfter: number;
  };
};

type Measurement = {
  sensorId: string;
  value: number;
  timestamp: number;
};

type NewState = {
  actuatorId: string;
  enabled: boolean;
};

export const determineActions = (
  actions: Array<Action>,
  measurements: Array<Measurement>,
): Array<NewState> => {};
