import Dashboard from '../Dashboard/Dashboard';
import { SensorsPanel } from '../SensorsPanel/SensorsPanel';
import { HeatingSeasonCard } from '../HeatingSeasonCard/HeatingSeasonCard';

export default function DashboardContainer() {
 
  
  return (
    <div className="app">
      <Dashboard />
      <div className="sensors-panel container">
        <SensorsPanel />
        <HeatingSeasonCard />
      </div>
    </div>
  );
}
