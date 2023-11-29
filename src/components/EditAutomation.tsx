import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRefData } from "~/client/hooks/useRefData";
import { type Action } from "~/client/utils/determineActions";
import toast from "react-hot-toast";
import { updateRefData } from "~/client/hooks/updateRefData";

interface AddAutomationProps {
  children?: React.ReactNode;
  action: Action & { id: string };
}

export type Sensor = { name: string; triggers: string[] } & (
  | {
      type: "gas" | "temperature";
      triggers: ["gt", "lt"];
    }
  | {
      type: "movement" | "rain";
      triggers: ["on", "off"];
    }
);

export const getTriggerLabel = (trigger: string) => {
  switch (trigger) {
    case "gt":
      return "Mayor que";
    case "lt":
      return "Menor que";
    case "on":
      return "Encendido";
    case "off":
      return "Apagado";
    default:
      return "";
  }
};

export type Actuator = {
  enabled: boolean;
  type: string;
  name: string;
};

const EditAutomation: React.FC<AddAutomationProps> = ({
  action: {
    actuatorId: initialActuatorId,
    newState: initialNewState,
    sensorId: initialSensorId,
    trigger: initialTrigger,
    id,
  },
}) => {
  const [actuator_db, actuator_db_loading] = useRefData<Actuator>({
    path: "actuators",
  });
  const [sensor_db, sensor_db_loading] = useRefData<Sensor>({
    path: "sensors",
  });
  const { updateData } = updateRefData("actions/" + id);

  const [sensorId, setSensorId] = useState<string>(initialSensorId);
  const [actuatorId, setActuatorId] = useState<string>(initialActuatorId);
  const [trigger, setTrigger] = useState<string>(initialTrigger);
  const [newState, setNewState] = useState<boolean>(initialNewState.enabled);
  const [parameter, setParameter] = useState<string>(
    initialNewState.metadata.value.toString(),
  );
  const [stopAfter, setStopAfter] = useState<string>(
    initialNewState.stopAfter.toString(),
  );
  const [revert, setRevert] = useState<boolean>(initialNewState.stopAfter > 0);

  const [selectedSensor, setSelectedSensor] = useState<
    Sensor & { id: string }
  >();
  const [selectedActuator, setSelectedActuator] = useState<
    Actuator & { id: string }
  >();

  useEffect(() => {
    if (!actuator_db_loading) {
      setSelectedActuator(actuator_db?.find((a) => a.id === initialActuatorId));
    }
  }, [actuator_db_loading]);

  useEffect(() => {
    if (!sensor_db_loading) {
      setSelectedSensor(sensor_db?.find((s) => s.id === initialSensorId));
    }
  }, [sensor_db_loading]);

  const restoreState = () => {
    setSensorId("");
    setActuatorId("");
    setTrigger("");
    setNewState(false);
    setParameter("");
    setStopAfter("");
    setRevert(false);
    setSelectedSensor(undefined);
    setSelectedActuator(undefined);
  };

  const handleSubmit = async () => {
    const action: Action = {
      actuatorId: selectedActuator?.id ?? "",
      sensorId: selectedSensor?.id ?? "",
      trigger: trigger as "gt" | "lt" | "on" | "off",
      newState: {
        enabled: newState,
        metadata:
          trigger === "gt" || trigger === "lt"
            ? { value: parseInt(parameter) }
            : { value: 0 },
        stopAfter: revert ? parseInt(stopAfter) : 0,
      },
    };

    await updateData(action);
    restoreState();
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button asChild variant="outline">
            <span>Editar</span>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pl-3 text-left">
              Editar Automatización
            </DialogTitle>
            <DialogDescription>
              Selecciona un sensor y un actuador para editar una automatización
            </DialogDescription>

            <div className="grid gap-y-4 py-8">
              <div className="flex w-full items-center justify-between space-x-4">
                <p className="text-base font-semibold">Cuando el sensor:</p>
                <div>
                  <Select
                    value={sensorId}
                    onValueChange={(v) => {
                      setSensorId(v);
                      const sensor = sensor_db?.find((s) => s.id === v);
                      setSelectedSensor(sensor);
                      setTrigger(sensor?.triggers[0] ?? "");
                    }}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Selecciona un sensor" />
                    </SelectTrigger>
                    <SelectContent>
                      {!sensor_db_loading &&
                        sensor_db?.map((sensor, idx) => (
                          <SelectItem
                            value={sensor.id}
                            key={`${sensor.id}_${idx}`}
                          >
                            {sensor.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selectedSensor && (
                <div className="flex w-full items-center justify-between space-x-4">
                  <p className="text-base font-semibold">
                    {selectedSensor.triggers.includes("on")
                      ? "Cuando esta: "
                      : "Cuando el valor es: "}
                  </p>

                  <div className="flex w-[220px] space-x-2">
                    <Select
                      value={trigger}
                      onValueChange={(v) => {
                        setTrigger(v);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Escoge..." />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSensor.triggers.map((trigger, idx) => (
                          <SelectItem value={trigger} key={`${trigger}_${idx}`}>
                            {getTriggerLabel(trigger)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedSensor.triggers.includes("gt") && (
                      <Input
                        value={parameter}
                        onChange={(e) => {
                          const canParse = parseInt(e.target.value);
                          if (isNaN(canParse)) {
                            toast.error("El valor debe ser un número");
                          }
                          setParameter(e.target.value);
                        }}
                        className="w-full"
                        placeholder="Valor"
                      />
                    )}
                  </div>
                </div>
              )}
              <div className="flex w-full items-center justify-between space-x-4">
                <p className="text-base font-semibold">Cambiar actuador: </p>
                <div>
                  <Select
                    value={actuatorId}
                    onValueChange={(v) => {
                      setActuatorId(v);
                      setSelectedActuator(actuator_db?.find((a) => a.id === v));
                    }}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Selecciona un actuador" />
                    </SelectTrigger>
                    <SelectContent>
                      {!actuator_db_loading &&
                        actuator_db?.map((actuator, idx) => (
                          <SelectItem
                            value={actuator.id}
                            key={`${actuator.id}_${idx}`}
                          >
                            {actuator.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selectedActuator && (
                <div className="flex w-full items-center justify-between space-x-4">
                  <p className="text-base font-semibold">A nuevo valor: </p>
                  <div className="flex w-[220px] space-x-2">
                    <Select
                      value={newState ? "on" : "off"}
                      onValueChange={(v) => {
                        setNewState(v === "on");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Escoge..." />
                      </SelectTrigger>
                      <SelectContent>
                        {/* true or false, encendido y apagado */}
                        <SelectItem value="on">Encendido</SelectItem>
                        <SelectItem value="off">Apagado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="flex w-full items-center justify-between space-x-4">
                <p className="text-base font-semibold">Activar duración:</p>
                <div className="flex w-[220px] items-center space-x-8">
                  <Switch
                    checked={revert}
                    onCheckedChange={(v) => setRevert(v)}
                  />
                  {revert && (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={stopAfter}
                        onChange={(e) => {
                          const canParse = parseInt(e.target.value);
                          if (isNaN(canParse)) {
                            toast.error("El valor debe ser un número");
                          }
                          setStopAfter(e.target.value);
                        }}
                        className="w-full"
                        placeholder="Al pasar"
                      />
                      <p>Segs</p>
                    </div>
                  )}
                </div>
              </div>
              {false && (
                <div className="flex w-full items-center justify-between space-x-4">
                  <p className="text-base font-semibold">Detener después:</p>
                  <div className="absolute flex w-[220px] items-center space-x-2">
                    <Input
                      value={parameter}
                      onChange={(e) => {
                        const canParse = parseInt(e.target.value);
                        if (isNaN(canParse)) {
                          toast.error("El valor debe ser un número");
                        }
                        setStopAfter(e.target.value);
                      }}
                      className="w-full"
                      placeholder="Al pasar"
                    />
                    <p className="relative top-0">Segs</p>
                  </div>
                </div>
              )}
              <div className="flex w-full items-center space-x-4 pt-4">
                <DialogClose>
                  <Button variant="outline" asChild>
                    <span>Cancelar</span>
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button onClick={handleSubmit} asChild>
                    <span>Editar Automatización</span>
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditAutomation;
