import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import DashboardContainer from './components/containers/DashboardContainer';
import { AuthenticatedPage } from './components/AuthenticatedPage';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        {' '}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <AuthenticatedPage>
                <DashboardContainer />
              </AuthenticatedPage>
            }
          />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
};
export default App;
