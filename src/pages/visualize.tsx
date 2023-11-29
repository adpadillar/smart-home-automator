import type { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "~/client/firebase";
import { useRefData } from "~/client/hooks/useRefData";
import { type Sensor } from "~/components/AddAutomation";
import LineChart from "~/components/LineChart";
import Redirect from "~/components/Redirect";

interface VisualizePageProps {
  children?: React.ReactNode;
}

const VisualizePage: NextPage<VisualizePageProps> = () => {
  const [user, loading] = useAuthState(auth);
  const [sensors, loadingSensors] = useRefData<Sensor>({ path: "sensors" });

  if (!loading && !user) return <Redirect path="/login" />;

  return (
    <div>
      {loadingSensors && <p>Loading sensors...</p>}
      {!loadingSensors && sensors && (
        <div className="grid grid-cols-1 gap-4">
          {sensors.map((sensor) => (
            <LineChart key={sensor.id} sensor={sensor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VisualizePage;
