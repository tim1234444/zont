import Dashboard from '../Dashboard/Dashboard';
import { SensorsPanel } from '../SensorsPanel/SensorsPanel';
import { HeatingSeasonCard } from '../HeatingSeasonCard/HeatingSeasonCard';
import { useContext } from 'react';
import { SoundContext } from '../../context/SoundsContext';
import SoundPermissionModal from '../SoundPermissionModal/SoundPermissionModal';

export default function DashboardContainer() {
  const { soundEnabled } = useContext(SoundContext);
  if (!soundEnabled) return <SoundPermissionModal/>;
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
