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

// export const determineActions = (
//   actions: Array<Action>,
//   measurements: Array<Measurement>,
// ): Array<NewState> => {

  
//   return [];
// };

export const determineActions = (
  actions: Array<Action>,
  measurements: Array<Measurement>,
): Array<NewState> => {
  const newStateArray: Array<NewState> = [];

  actions.forEach((action) => {
    const relevantMeasurement = measurements.find(
      (measurement) => measurement.sensorId === action.sensorId
    );

    if (relevantMeasurement) {
      switch (action.trigger) {
        case "lt":
          if (relevantMeasurement.value < action.newState.metadata.value) {
            newStateArray.push({
              actuatorId: action.actuatorId,
              enabled: action.newState.enabled,
            });
          }
          break;

        case "gt":
          if (relevantMeasurement.value > action.newState.metadata.value) {
            newStateArray.push({
              actuatorId: action.actuatorId,
              enabled: action.newState.enabled,
            });
          }
          break;

        case "on":
          if (relevantMeasurement.value === action.newState.metadata.value) {
            newStateArray.push({
              actuatorId: action.actuatorId,
              enabled: action.newState.enabled,
            });
          }
          break;

        case "off":
          if (relevantMeasurement.value !== action.newState.metadata.value) {
            newStateArray.push({
              actuatorId: action.actuatorId,
              enabled: action.newState.enabled,
            });
          }
          break;

        default:
          break;
      }
    }
  });

  return newStateArray;
};