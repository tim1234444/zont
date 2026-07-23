import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import DashboardContainer from './components/containers/DashboardContainer';
import { AuthenticatedPage } from './components/AuthenticatedPage';
import { TTSProvider } from './services/TTSProvider';

const App: React.FC = () => {
  return (
    <TTSProvider>
      <BrowserRouter>
        {' '}
        <Routes>
          <Route path="/tech" element={<LoginPage />} />
          <Route path="/tech/dashboard" element={<DashboardContainer />} />{' '}
        </Routes>
      </BrowserRouter>
    </TTSProvider>
  );
};
export default App;
