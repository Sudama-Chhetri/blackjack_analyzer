import { useState } from 'react';
import { Link } from 'react-router-dom';

function AnalyticsPage() {
  const [showBasicStrategy, setShowBasicStrategy] = useState(false); // State for chart visibility

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard (Barebones)</h1>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Landing Page
        </Link>
      </header>
      <main className="flex-grow p-4 flex space-x-4">
        {/* Left Panel: Analytics Graphs */}
        <div className="w-2/3 bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col space-y-6 border border-gray-700">
          <p>This is the barebones Analytics Page. If you see this, the issue is in the more complex code.</p>
          <button onClick={() => setShowBasicStrategy(!showBasicStrategy)}>
            Toggle Basic Strategy Chart
          </button>
          {showBasicStrategy && (
            <p>Basic Strategy Chart content would go here.</p>
          )}
        </div>

        {/* Right Panel: Basic Strategy Chart */}
        <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col space-y-6 border border-gray-700 overflow-y-auto">
          <div className="bg-gray-700 p-4 rounded-md border border-gray-600 flex-grow">
            <h2 
              className="text-xl font-bold mb-4 text-gray-300 cursor-pointer hover:text-white transition-colors duration-200"
              onClick={() => setShowBasicStrategy(!showBasicStrategy)}
            >
              Basic Strategy Chart {showBasicStrategy ? '▼' : '►'}
            </h2>
            {showBasicStrategy && (
              <>
                <h4 className="text-md font-bold mb-2 text-gray-400">Hard Totals</h4>
                <p>Table content here</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AnalyticsPage;