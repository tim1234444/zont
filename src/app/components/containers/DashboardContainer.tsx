import Dashboard from '../Dashboard/Dashboard';
import { SensorsPanel } from '../SensorsPanel/SensorsPanel';
import { HeatingSeasonCard } from '../HeatingSeasonCard/HeatingSeasonCard';
import SoundPermissionModal from '../SoundPermissionModal/SoundPermissionModal';
import { useState } from 'react';
import AlertHistory from '../AlertHistory/AlertHistory';
import { WeatherCard } from '../WeatherCard/WeatherCard';
import TextInfo from '../TextInfo/TextInfo';

export default function DashboardContainer() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  if (!soundEnabled)
    return (
      <SoundPermissionModal
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
    );
  return (
    <div className="app">
      <Dashboard />
      <div className="sensors-panel container">
        <SensorsPanel />
        <HeatingSeasonCard />
        <WeatherCard />
        <TextInfo />
      </div>
      <div className="container">
        <AlertHistory />
      </div>
    </div>
  );
}
