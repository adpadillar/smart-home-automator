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
  value: number | boolean;
  timestamp: number;
};

export type NewState = {
  actuatorId: string;
  enabled: boolean;
  stopAfter: number;
  timestamp: number;
};

export const determineActions = (
  actions: Array<Action & { id: string }>,
  measurements: Array<Measurement & { id: string }>,
): Array<NewState> => {
  const newStateArray: Array<NewState> = [];

  actions.forEach((action) => {
    const relevantMeasurements = measurements.filter(
      (measurement) => measurement.sensorId === action.sensorId,
    );

    relevantMeasurements.forEach((relevantMeasurement) => {
      // check timestamp to see if measurement is still relevant
      if (relevantMeasurement) {
        const now = Date.now();
        const measurementAge = now - relevantMeasurement.timestamp;
        // if it's older than 20 seconds, don't use it
        if (measurementAge > 16_000) {
          return;
        }
      }

      if (relevantMeasurement) {
        switch (action.trigger) {
          case "lt":
            const castedValue1 = relevantMeasurement.value as number;
            if (castedValue1 < action.newState.metadata.value) {
              newStateArray.push({
                actuatorId: action.actuatorId,
                enabled: action.newState.enabled,
                stopAfter: action.newState.stopAfter,
                timestamp: relevantMeasurement.timestamp,
              });
            }
            break;

          case "gt":
            const castedValue2 = relevantMeasurement.value as number;
            if (castedValue2 > action.newState.metadata.value) {
              newStateArray.push({
                actuatorId: action.actuatorId,
                enabled: action.newState.enabled,
                stopAfter: action.newState.stopAfter,
                timestamp: relevantMeasurement.timestamp,
              });
            }
            break;

          case "on":
            if (relevantMeasurement.value === true) {
              newStateArray.push({
                actuatorId: action.actuatorId,
                enabled: action.newState.enabled,
                stopAfter: action.newState.stopAfter,
                timestamp: relevantMeasurement.timestamp,
              });
            }
            break;

          case "off":
            if (relevantMeasurement.value === false) {
              newStateArray.push({
                actuatorId: action.actuatorId,
                enabled: action.newState.enabled,
                stopAfter: action.newState.stopAfter,
                timestamp: relevantMeasurement.timestamp,
              });
            }
            break;

          default:
            break;
        }
      }
    });
  });

  // if there are multiple actions for the same actuator, only use the most recent one
  const actuatorIds = newStateArray.map((newState) => newState.actuatorId);
  const uniqueActuatorIds = Array.from(new Set(actuatorIds));

  const uniqueNewStateArray = uniqueActuatorIds.map((actuatorId) => {
    const relevantNewStates = newStateArray.filter(
      (newState) => newState.actuatorId === actuatorId,
    );
    const mostRecentNewState = relevantNewStates.reduce((prev, curr) =>
      prev.timestamp > curr.timestamp ? prev : curr,
    );
    return mostRecentNewState;
  });

  return uniqueNewStateArray;
};
