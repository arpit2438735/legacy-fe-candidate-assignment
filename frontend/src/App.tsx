import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { HeadlessAuth } from './components/Auth/HeadlessAuth';
import { Dashboard } from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const { primaryWallet } = useDynamicContext();

  return (
    <div className="app">
      {!primaryWallet ? <HeadlessAuth /> : <Dashboard />}
    </div>
  );
}

export default App;
