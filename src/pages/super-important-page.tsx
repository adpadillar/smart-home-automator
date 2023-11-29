import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { updateRefData } from "~/client/hooks/updateRefData";
import { useRefData } from "~/client/hooks/useRefData";
import {
  determineActions,
  type Action,
  type Measurement,
} from "~/client/utils/determineActions";

interface SuperImportantPageProps {
  children?: React.ReactNode;
}

const SuperImportantPage: NextPage<SuperImportantPageProps> = () => {
  const { updateData } = updateRefData("actuators");
  const [measurements, measurementLoading] = useRefData<Measurement>({
    path: "measurements",
    sort: (a, b) => a.timestamp - b.timestamp,
    limit: 5,
  });
  const [actions, actionsLoading] = useRefData<Action>({
    path: "actions",
    limit: 5,
  });

  useEffect(() => {
    if (!actionsLoading) {
      const changes = determineActions(actions ?? [], measurements ?? []);

      const table: Record<string, boolean> = {};

      changes.forEach((c) => {
        const hash = `${c.actuatorId}-${c.enabled}-${c.stopAfter}`;

        if (table[hash]) return;
        table[hash] = true;

        console.log("tried to update");
        console.log(table);

        void updateData({
          ["/" + c.actuatorId + "/enabled"]: c.enabled,
        });

        if (c.stopAfter != 0) {
          setTimeout(() => {
            void updateData({
              ["/" + c.actuatorId + "/enabled"]: !c.enabled,
            });
          }, c.stopAfter * 1000);
        }
      });

      console.log(changes);
    }
  }, [actions, measurements]);

  if (measurementLoading) return <p>Loading...</p>;

  return <p>hello</p>;
};

export default SuperImportantPage;
