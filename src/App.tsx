import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LingoProvider } from 'lingo.dev/react/client';
import AppContent from './components/AppContent';
import './App.css';

function App() {
  return (
    <LingoProvider dictionary={{}}>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </LingoProvider>
  );
}

export default App;