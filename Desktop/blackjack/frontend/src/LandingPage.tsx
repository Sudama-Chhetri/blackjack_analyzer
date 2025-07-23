import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-sans">
      <div className="flex justify-center items-center mb-8 space-x-16">
        {/* Ace of Spades Card */}
        <div className="relative w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col justify-between items-center p-4 border border-gray-300 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
          <span className="text-black text-8xl font-bold">A</span>
          <span className="text-black text-[10rem]">♠️</span>
          <span className="text-black text-8xl font-bold transform rotate-180">A</span>
        </div>

        {/* Jack of Hearts Card */}
        <div className="relative w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col justify-between items-center p-4 border border-gray-300 transform rotate-6 hover:rotate-0 transition-transform duration-300">
          <span className="text-red-600 text-8xl font-bold">J</span>
          <span className="text-red-600 text-[10rem]">♥️</span>
          <span className="text-red-600 text-8xl font-bold transform rotate-180">J</span>
        </div>
      </div>

      <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 font-serif">
        Blackjack Analyzer
      </h1>
      <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl leading-relaxed">
        Dive into the world of blackjack with real-time analysis. Track card counts, master basic strategy,
        and optimize your bets to gain a significant edge over the house. Your ultimate tool for strategic play.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link to="/analyzer">
          <button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-xl">
            Start Blackjack Analyzer
          </button>
        </Link>
        <Link to="/analytics">
          <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-xl">
            View Analytics Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
