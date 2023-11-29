import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useRefData } from "~/client/hooks/useRefData";
import { type Action } from "~/client/utils/determineActions";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Actuator, type Sensor, getTriggerLabel } from "./AddAutomation";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteRefData } from "~/client/hooks/deleteRefData";
import EditAutomation from "./EditAutomation";

interface AllAutomationsProps {
  children?: React.ReactNode;
}

const AllAutomations: React.FC<AllAutomationsProps> = () => {
  const { deleteData } = deleteRefData();
  const [automations, loading] = useRefData<Action>({
    path: "actions",
    limit: 100,
  });
  const [sensors, loadingSensors] = useRefData<Sensor>({
    path: "sensors",
    limit: 100,
  });
  const [actuators, loadingActuators] = useRefData<Actuator>({
    path: "actuators",
    limit: 100,
  });

  return (
    <div>
      {loading && loadingSensors && loadingActuators && (
        <p>Loading automations...</p>
      )}
      {!loading &&
        automations &&
        !loadingSensors &&
        sensors &&
        !loadingActuators &&
        actuators && (
          <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2">
            {automations.map((automation, i) => (
              <Card key={automation.id + i}>
                <CardHeader>
                  <CardTitle>Automatizacion {i + 1}</CardTitle>
                  <CardDescription className="pt-2">
                    {automation.newState.metadata.value ? (
                      <>
                        Cuando el sensor "
                        {sensors.find((s) => s.id == automation.sensorId)?.name}
                        " registre valores{" "}
                        {getTriggerLabel(automation.trigger).toLowerCase()}{" "}
                        {automation.newState.metadata.value}, el actuador "
                        {
                          actuators.find((a) => a.id == automation.actuatorId)
                            ?.name
                        }
                        " se{" "}
                        {automation.newState.metadata.value
                          ? "encenderá"
                          : "apagará"}
                      </>
                    ) : (
                      <>
                        Cuando el sensor "
                        {sensors.find((s) => s.id == automation.sensorId)?.name}
                        " este{" "}
                        {getTriggerLabel(automation.trigger).toLowerCase()}, el
                        actuador "
                        {
                          actuators.find((a) => a.id == automation.actuatorId)
                            ?.name
                        }
                        " se{" "}
                        {automation.newState.metadata.value
                          ? "encenderá"
                          : "apagará"}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex space-x-2">
                  <EditAutomation action={automation} />
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button asChild>
                        <span>Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Estas seguro de eliminar esta automatizacion?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta accion no se puede deshacer, una vez eliminada la
                          automatizacion, será borrada de nuestros servidores y
                          no podras recuperarla.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className={buttonVariants({ variant: "destructive" })}
                          onClick={() => {
                            void deleteData("actions/" + automation.id);
                          }}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
};

export default AllAutomations;
