import React, { useState } from 'react';

import Header from './components/Header'
import Predictor from './pages/Predictor';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('prediction');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '40px 24px' }}>
        {currentPage === 'prediction' ? (
          <Predictor />
        ) : (
          <Dashboard />
        )}
      </main>

      <footer style={{ backgroundColor: '#1a365d', color: 'white', padding: '32px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>
            © 2025 Diabetes Risk Predictor. For educational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;