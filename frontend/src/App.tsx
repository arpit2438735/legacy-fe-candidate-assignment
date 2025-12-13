import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { HeadlessAuth } from './components/Auth/HeadlessAuth';
import { Dashboard } from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const { isAuthenticated } = useDynamicContext();

  return (
    <div className="app">
      {!isAuthenticated ? <HeadlessAuth /> : <Dashboard />}
    </div>
  );
}

export default App;
