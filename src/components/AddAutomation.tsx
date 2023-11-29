import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface AddAutomationProps {
  children?: React.ReactNode;
}

export type Sensor = { name: string } & (
  | {
      type: "gas" | "temperature";
      triggers: ["gt", "lt"];
    }
  | {
      type: "movement" | "rain";
      triggers: ["on", "off"];
    }
);

const getTriggerLabel = (trigger: string) => {
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

const AddAutomation: React.FC<AddAutomationProps> = () => {
  const [actuator_db, actuator_db_loading] = useRefData<Actuator>("actuators");
  const [sensor_db, sensor_db_loading] = useRefData<Sensor>("sensors");

  const [sensorId, setSensorId] = useState<string>();
  const [actuatorId, setActuatorId] = useState<string>();

  return (
    <div className="pt-4">
      <Dialog>
        <div className="flex space-x-2">
          <Input placeholder="Buscar automatizaciones" />
          <DialogTrigger>
            <Button asChild variant="outline">
              <span>Agregar Automatización</span>
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pl-1 text-left">
              Crear Automatización
            </DialogTitle>
            <DialogDescription>
              Selecciona un sensor y un actuador para crear una automatización
            </DialogDescription>

            <div className="grid gap-y-4 py-8">
              <div className="flex w-full items-center justify-between space-x-4">
                <p className="text-base font-semibold">Sensor</p>
                <div>
                  <Select
                    value={sensorId}
                    onValueChange={(v) => setSensorId(v)}
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
              <div className="flex w-full items-center justify-between space-x-4">
                <p className="text-base font-semibold">Actuador</p>
                <div>
                  <Select
                    value={actuatorId}
                    onValueChange={(v) => setActuatorId(v)}
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
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddAutomation;
