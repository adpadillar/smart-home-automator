export type Action = {
  sensorId: string;
  actuatorId: string;
  trigger: "lt" | "gt" | "on" | "off";
  newState: {
    enabled: boolean;
    metadata: {
      value: number;
    };
    stopAfter: number;
  };
};

export type Measurement = {
  sensorId: string;
  value: number;
  timestamp: number;
};

export type NewState = {
  actuatorId: string;
  enabled: boolean;
};

export const determineActions = (
  actions: Array<Action>,
  measurements: Array<Measurement>,
): Array<NewState> => {
  return [];
};
