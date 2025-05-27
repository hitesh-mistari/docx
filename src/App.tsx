import React from 'react';
import { DocumentUpload } from './components/DocumentUpload';
import { Sidebar } from './components/Sidebar';
import { InfographicPreview } from './components/InfographicPreview';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';

function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-6">
              <DocumentUpload />
              <InfographicPreview />
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;