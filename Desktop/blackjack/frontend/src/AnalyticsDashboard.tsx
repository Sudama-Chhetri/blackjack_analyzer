import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';

// Initial mock data is now an empty array
const initialSessionData = [];

function AnalyticsDashboard() {
  const [sessionData, setSessionData] = useState(() => {
    const savedData = localStorage.getItem('blackjackSessionData');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [newSession, setNewSession] = useState({ date: '', buyIn: '', cashout: '', roundsPlayed: '', roundsWon: '' });
  const [isTableVisible, setIsTableVisible] = useState(true);

  // Save sessionData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('blackjackSessionData', JSON.stringify(sessionData));
  }, [sessionData]);

  const handleAddSession = () => {
    const { date, buyIn, cashout, roundsPlayed, roundsWon } = newSession;

    if (!date || !buyIn || !cashout || !roundsPlayed || !roundsWon) {
      alert('Please fill all fields to add a session.');
      return;
    }

    const netProfit = parseInt(cashout) - parseInt(buyIn);
    const winRate = parseInt(roundsWon) / parseInt(roundsPlayed);

    setSessionData(prevData => [
      ...prevData,
      {
        date,
        session: `Session ${prevData.length + 1}`,
        buyIn: parseInt(buyIn),
        cashout: parseInt(cashout),
        netProfit,
        winRate,
        roundsPlayed: parseInt(roundsPlayed)
      }
    ]);

    setNewSession({ date: '', buyIn: '', cashout: '', roundsPlayed: '', roundsWon: '' }); // Reset form
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <header className="bg-gray-800 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-bold font-serif text-yellow-300">Analytics Dashboard</h1>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded font-sans transition-colors duration-300">
          Go to Landing Page
        </Link>
      </header>
      <main className="flex-grow p-6">
        {/* Add New Session Form */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl mb-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-indigo-400">Add New Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sessionDate" className="block text-sm font-medium text-gray-300 mb-1">Date:</label>
              <input type="date" id="sessionDate" value={newSession.date} onChange={(e) => setNewSession({...newSession, date: e.target.value})} className="bg-gray-700 p-2 rounded-md w-full" />
            </div>
            <div>
              <label htmlFor="buyIn" className="block text-sm font-medium text-gray-300 mb-1">Buy-in (₹):</label>
              <input type="number" id="buyIn" placeholder="e.g., 100" value={newSession.buyIn} onChange={(e) => setNewSession({...newSession, buyIn: e.target.value})} className="bg-gray-700 p-2 rounded-md w-full" />
            </div>
            <div>
              <label htmlFor="cashout" className="block text-sm font-medium text-gray-300 mb-1">Cashout (₹):</label>
              <input type="number" id="cashout" placeholder="e.g., 150" value={newSession.cashout} onChange={(e) => setNewSession({...newSession, cashout: e.target.value})} className="bg-gray-700 p-2 rounded-md w-full" />
            </div>
            <div>
              <label htmlFor="roundsPlayed" className="block text-sm font-medium text-gray-300 mb-1">Rounds Played:</label>
              <input type="number" id="roundsPlayed" placeholder="e.g., 100" value={newSession.roundsPlayed} onChange={(e) => setNewSession({...newSession, roundsPlayed: e.target.value})} className="bg-gray-700 p-2 rounded-md w-full" />
            </div>
            <div>
              <label htmlFor="roundsWon" className="block text-sm font-medium text-gray-300 mb-1">Rounds Won:</label>
              <input type="number" id="roundsWon" placeholder="e.g., 55" value={newSession.roundsWon} onChange={(e) => setNewSession({...newSession, roundsWon: e.target.value})} className="bg-gray-700 p-2 rounded-md w-full" />
            </div>
            <div className="flex items-end">
              <button onClick={handleAddSession} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">Add Session</button>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">Net Profit Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={sessionData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="session" stroke="#E2E8F0" />
                <YAxis stroke="#E2E8F0" />
                <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                <Area type="monotone" dataKey="netProfit" stroke="#2E7D32" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-green-400">Buy-in vs. Cashout</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="session" stroke="#E2E8F0" />
                <YAxis stroke="#E2E8F0" />
                <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                <Legend />
                <Bar dataKey="buyIn" fill="#1565C0" name="Buy-in" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cashout" fill="#FF8F00" name="Cashout" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Win Rate Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="session" stroke="#E2E8F0" />
                <YAxis domain={[0, 1]} stroke="#E2E8F0" />
                <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                <Legend />
                <Line type="monotone" dataKey="winRate" stroke="#D84315" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-red-400">Rounds Played Per Session</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="session" stroke="#E2E8F0" />
                <YAxis stroke="#E2E8F0" />
                <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                <Legend />
                <Bar dataKey="roundsPlayed" fill="#6A1B9A" name="Rounds Played" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl mt-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-400">Session Data</h2>
            <button onClick={() => setIsTableVisible(!isTableVisible)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              {isTableVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {isTableVisible && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-600">Date</th>
                    <th className="py-2 px-4 border-b border-gray-600">Session</th>
                    <th className="py-2 px-4 border-b border-gray-600">Buy-in</th>
                    <th className="py-2 px-4 border-b border-gray-600">Cashout</th>
                    <th className="py-2 px-4 border-b border-gray-600">Net Profit</th>
                    <th className="py-2 px-4 border-b border-gray-600">Win Rate</th>
                    <th className="py-2 px-4 border-b border-gray-600">Rounds Played</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionData.map((s, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b border-gray-600">{s.date}</td>
                      <td className="py-2 px-4 border-b border-gray-600">{s.session}</td>
                      <td className="py-2 px-4 border-b border-gray-600">₹{s.buyIn}</td>
                      <td className="py-2 px-4 border-b border-gray-600">₹{s.cashout}</td>
                      <td className={`py-2 px-4 border-b border-gray-600 ${s.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{s.netProfit}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-600">{(s.winRate * 100).toFixed(2)}%</td>
                      <td className="py-2 px-4 border-b border-gray-600">{s.roundsPlayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AnalyticsDashboard;

