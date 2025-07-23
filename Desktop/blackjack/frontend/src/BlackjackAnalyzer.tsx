import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

// Define the Basic Strategy Chart data
const basicStrategy = {
  hardTotals: [
    { player: '5-8', dealer: 'Any', action: 'Hit' },
    { player: '9', dealer: '2', action: 'Hit' },
    { player: '9', dealer: '3-6', action: 'Double' },
    { player: '9', dealer: '7-A', action: 'Hit' },
    { player: '10', dealer: '2-9', action: 'Double' },
    { player: '10', dealer: '10-A', action: 'Hit' },
    { player: '11', dealer: 'Any', action: 'Double' },
    { player: '12', dealer: '2-3', action: 'Hit' },
    { player: '12', dealer: '4-6', action: 'Stand' },
    { player: '12', dealer: '7-A', action: 'Hit' },
    { player: '13-16', dealer: '2-6', action: 'Stand' },
    { player: '13-16', dealer: '7-A', action: 'Hit' },
    { player: '17+', dealer: 'Any', action: 'Stand' },
  ],
  softTotals: [
    { player: 'A,2 (13)', dealer: '2-4', action: 'Hit' },
    { player: 'A,2 (13)', dealer: '5-6', action: 'Double' },
    { player: 'A,2 (13)', dealer: '7-A', action: 'Hit' },
    { player: 'A,3 (14)', dealer: '2-4', action: 'Hit' },
    { player: 'A,3 (14)', dealer: '5-6', action: 'Double' },
    { player: 'A,3 (14)', dealer: '7-A', action: 'Hit' },
    { player: 'A,4 (15)', dealer: '2-3', action: 'Hit' },
    { player: 'A,4 (15)', dealer: '4-6', action: 'Double' },
    { player: 'A,4 (15)', dealer: '7-A', action: 'Hit' },
    { player: 'A,5 (16)', dealer: '2-3', action: 'Hit' },
    { player: 'A,5 (16)', dealer: '4-6', action: 'Double' },
    { player: 'A,5 (16)', dealer: '7-A', action: 'Hit' },
    { player: 'A,6 (17)', dealer: '2', action: 'Hit' },
    { player: 'A,6 (17)', dealer: '3-6', action: 'Double' },
    { player: 'A,6 (17)', dealer: '7-A', action: 'Hit' },
    { player: 'A,7 (18)', dealer: '2,7,8', action: 'Stand' },
    { player: 'A,7 (18)', dealer: '3-6', action: 'Double' },
    { player: 'A,7 (18)', dealer: '9-A', action: 'Hit' },
    { player: 'A,8 (19)', dealer: 'Any', action: 'Stand' },
    { player: 'A,9 (20)', dealer: 'Any', action: 'Stand' },
  ],
  pairs: [
    { player: '2,2', dealer: '2-7', action: 'Split' },
    { player: '2,2', dealer: '8-A', action: 'Hit' },
    { player: '3,3', dealer: '2-7', action: 'Split' },
    { player: '3,3', dealer: '8-A', action: 'Hit' },
    { player: '4,4', dealer: '5-6', action: 'Split' },
    { player: '4,4', dealer: 'Any other', action: 'Hit' },
    { player: '5,5', dealer: '2-9', action: 'Double' },
    { player: '5,5', dealer: '10-A', action: 'Hit' },
    { player: '6,6', dealer: '2-6', action: 'Split' },
    { player: '6,6', dealer: '7-A', action: 'Hit' },
    { player: '7,7', dealer: '2-7', action: 'Split' },
    { player: '7,7', dealer: '8-A', action: 'Hit' },
    { player: '8,8', dealer: 'Any', action: 'Split' },
    { player: '9,9', dealer: '2-6,8,9', action: 'Split' },
    { player: '9,9', dealer: '7,10-A', action: 'Stand' },
    { player: 'A,A', dealer: 'Any', action: 'Split' },
    { player: '10,10', dealer: 'Any', action: 'Stand' },
  ],
};

// Helper function to convert card string to numerical value
const getCardValue = (card: string): number => {
  if (['J', 'Q', 'K'].includes(card)) return 10;
  if (card === 'A') return 11; // Initially treat Ace as 11
  return parseInt(card);
};

// Helper function to calculate hand total and determine if it's soft
const calculateHand = (card1: string, card2: string) => {
  const val1 = getCardValue(card1);
  const val2 = getCardValue(card2);
  let total = val1 + val2;
  let isSoft = false;

  if (card1 === 'A' || card2 === 'A') {
    isSoft = true;
  }

  // Adjust for Aces if total is over 21
  if (total > 21 && isSoft) {
    total -= 10; // Change one Ace from 11 to 1
    isSoft = false; // No longer soft if Ace is counted as 1
  }

  return { total, isSoft };
};

function BlackjackAnalyzer() {
  const [runningCount, setRunningCount] = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [shoeSize, setShoeSize] = useState(6); // Default to 6 decks
  const [penetration, setPenetration] = useState(75); // Default to 75%
  const [trueCount, setTrueCount] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1); // Track rounds

  const [playerCard1, setPlayerCard1] = useState('');
  const [playerCard2, setPlayerCard2] = useState('');
  const [dealerUpcard, setDealerUpcard] = useState('');

  const [cardCounts, setCardCounts] = useState<{ [key: string]: number }>({
    'A': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, 'J': 0, 'Q': 0, 'K': 0
  });
  const [cardHistory, setCardHistory] = useState<string[]>([]); // New state for card history

  // Bet sizing parameters
  const [baseBet, setBaseBet] = useState(10); // Default base bet
  const [bankroll, setBankroll] = useState(1000); // Default bankroll
  const [minBet, setMinBet] = useState(5); // Default minimum bet
  const [maxBet, setMaxBet] = useState(100); // Default maximum bet

  const [showBasicStrategy, setShowBasicStrategy] = useState(false); // State for chart visibility

  // Card values for dropdowns and manual input
  const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Calculate true count whenever runningCount, cardsPlayed, shoeSize, or penetration changes
  useEffect(() => {
    const totalCardsInShoe = shoeSize * 52;
    const cardsRemaining = totalCardsInShoe - cardsPlayed;
    const decksRemaining = cardsRemaining / 52;

    if (decksRemaining > 0) {
      setTrueCount(runningCount / decksRemaining);
    } else {
      setTrueCount(0); // Avoid division by zero
    }
  }, [runningCount, cardsPlayed, shoeSize, penetration]);

  const handleCardInput = (card: string) => {
    let countValue = 0;
    const cardValue = card.toUpperCase();

    if (['2', '3', '4', '5', '6'].includes(cardValue)) {
      countValue = 1;
    } else if (['10', 'J', 'Q', 'K', 'A'].includes(cardValue)) {
      countValue = -1;
    }
    // For 7, 8, 9, countValue remains 0

    setRunningCount(prevCount => prevCount + countValue);
    setCardsPlayed(prevPlayed => prevPlayed + 1);
    setCardCounts(prevCounts => ({
      ...prevCounts,
      [cardValue]: prevCounts[cardValue] + 1
    }));
    setCardHistory(prevHistory => [...prevHistory, cardValue]);
  };

  const handleDeleteLastCard = () => {
    if (cardHistory.length === 0) {
      return; // No cards to delete
    }

    const lastCard = cardHistory[cardHistory.length - 1];
    let countValue = 0;

    if (['2', '3', '4', '5', '6'].includes(lastCard)) {
      countValue = 1;
    } else if (['10', 'J', 'Q', 'K', 'A'].includes(lastCard)) {
      countValue = -1;
    }

    setRunningCount(prevCount => prevCount - countValue); // Reverse the count
    setCardsPlayed(prevPlayed => {
      const newCardsPlayed = prevPlayed - 1;
      if (newCardsPlayed === 0) {
        setRunningCount(0); // Reset running count if no cards are left
      }
      return newCardsPlayed;
    });
    setCardCounts(prevCounts => ({
      ...prevCounts,
      [lastCard]: prevCounts[lastCard] - 1
    }));
    setCardHistory(prevHistory => prevHistory.slice(0, -1)); // Remove last card from history
  };

  const nextRound = () => {
    setRoundNumber(prevRound => prevRound + 1);
    // Reset player/dealer cards for the new round
    setPlayerCard1('');
    setPlayerCard2('');
    setDealerUpcard('');
  };

  const resetShoe = () => {
    setRunningCount(0);
    setCardsPlayed(0);
    setTrueCount(0);
    setRoundNumber(1);
    setPlayerCard1('');
    setPlayerCard2('');
    setDealerUpcard('');
  };

  // Function to get suggested move
  const getSuggestedMove = () => {
    if (!playerCard1 || !playerCard2 || !dealerUpcard) {
      return "Select player cards and dealer upcard for recommendation.";
    }

    const playerHand = calculateHand(playerCard1, playerCard2);
    const dealerVal = getCardValue(dealerUpcard);

    // Check for Pairs first
    if (playerCard1 === playerCard2) {
      const pairVal = getCardValue(playerCard1);
      for (const rule of basicStrategy.pairs) {
        const rulePlayerVal = getCardValue(rule.player.split(',')[0]);

        if (pairVal === rulePlayerVal) {
          let dealerRangeMin = 0;
          let dealerRangeMax = 0;
          if (rule.dealer === 'Any') {
            dealerRangeMin = 2;
            dealerRangeMax = 11;
          } else if (rule.dealer.includes('-')) {
            const [min, max] = rule.dealer.split('-').map(getCardValue);
            dealerRangeMin = min;
            dealerRangeMax = max;
          } else if (rule.dealer.includes(',')) {
            const dealerValues = rule.dealer.split(',').map(getCardValue);
            if (dealerValues.includes(dealerVal)) {
              return rule.action;
            }
            continue;
          } else {
            if (getCardValue(rule.dealer) === dealerVal) {
              return rule.action;
            }
            continue;
          }

          if (dealerVal >= dealerRangeMin && dealerVal <= dealerRangeMax) {
            return rule.action;
          }
        }
      }
    }

    // Check for Soft Totals
    if (playerHand.isSoft) {
      for (const rule of basicStrategy.softTotals) {
        const playerRangeMatch = rule.player.match(/\((\d+)\)/);
        if (playerRangeMatch && playerHand.total === parseInt(playerRangeMatch[1])) {
          let dealerRangeMin = 0;
          let dealerRangeMax = 0;
          if (rule.dealer === 'Any') {
            dealerRangeMin = 2;
            dealerRangeMax = 11;
          } else if (rule.dealer.includes('-')) {
            const [min, max] = rule.dealer.split('-').map(getCardValue);
            dealerRangeMin = min;
            dealerRangeMax = max;
          } else if (rule.dealer.includes(',')) {
            const dealerValues = rule.dealer.split(',').map(getCardValue);
            if (dealerValues.includes(dealerVal)) {
              return rule.action;
            }
            continue;
          } else {
            if (getCardValue(rule.dealer) === dealerVal) {
              return rule.action;
            }
            continue;
          }

          if (dealerVal >= dealerRangeMin && dealerVal <= dealerRangeMax) {
            return rule.action;
          }
        }
      }
    }

    // Check for Hard Totals
    for (const rule of basicStrategy.hardTotals) {
      let playerRangeMin = 0;
      let playerRangeMax = 0;
      if (rule.player.includes('-')) {
        const [min, max] = rule.player.split('-').map(s => parseInt(s));
        playerRangeMin = min;
        playerRangeMax = max;
      } else {
        playerRangeMin = parseInt(rule.player.replace('+', ''));
        playerRangeMax = playerRangeMin;
        if (rule.player.includes('+')) playerRangeMax = 21;
      }

      if (playerHand.total >= playerRangeMin && playerHand.total <= playerRangeMax) {
        let dealerRangeMin = 0;
        let dealerRangeMax = 0;
        if (rule.dealer === 'Any') {
          dealerRangeMin = 2;
          dealerRangeMax = 11;
        } else if (rule.dealer.includes('-')) {
          const [min, max] = rule.dealer.split('-').map(getCardValue);
          dealerRangeMin = min;
          dealerRangeMax = max;
        } else if (rule.dealer.includes(',')) {
          const dealerValues = rule.dealer.split(',').map(getCardValue);
          if (dealerValues.includes(dealerVal)) {
            return rule.action;
          }
          continue;
        }

        if (dealerVal >= dealerRangeMin && dealerVal <= dealerRangeMax) {
          return rule.action;
        }
      }
    }

    return "No recommendation (uncommon hand or error).";
  };

  // Function to get bet size recommendation
  const getBetSizeRecommendation = () => {
    if (trueCount <= 1) {
      return `Bet: ${minBet} (True count too low)`;
    }

    let recommendedBet = baseBet * (trueCount - 1);
    recommendedBet = Math.max(minBet, recommendedBet);
    recommendedBet = Math.min(maxBet, recommendedBet);

    if (recommendedBet > bankroll) {
      return `Bet: ${bankroll} (Limited by bankroll)`;
    }

    return `Bet: ${recommendedBet.toFixed(2)}`;
  };

  // Function to calculate win rate probability
  const getWinRateProbability = () => {
    let advantage = 0;
    if (trueCount >= 2) {
      advantage = (trueCount - 1) * 0.015;
    } else if (trueCount <= -1) {
      advantage = (trueCount + 1) * 0.005;
    }

    const maxPenetrationForFullAdvantage = 75;
    const penetrationFactor = Math.min(1, penetration / maxPenetrationForFullAdvantage);
    const adjustedAdvantage = advantage * penetrationFactor;

    const baseWinRate = 0.42;
    const winRate = baseWinRate + adjustedAdvantage;

    return `${(winRate * 100).toFixed(2)}%`;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Blackjack Analyzer</h1>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded font-sans">
          Go to Landing Page
        </Link>
      </header>
      <main className="flex-grow p-4 flex space-x-4 bg-gray-800">
        {/* Left Panel: Live Card Counting & Session Controls */}
        <div className="w-1/3 bg-gray-900 p-6 rounded-lg shadow-xl flex flex-col space-y-6 border border-gray-700">
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">Live Card Count</h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {cardValues.map(card => (
                <button
                  key={card}
                  onClick={() => handleCardInput(card)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-md text-center"
                >
                  {card}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              onClick={nextRound}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md text-lg transition-colors duration-200 shadow-md"
            >
              Next Round
            </button>
            <button
              onClick={resetShoe}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md text-lg transition-colors duration-200 shadow-md"
            >
              Reset Shoe
            </button>
            <button
              onClick={handleDeleteLastCard}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md text-lg transition-colors duration-200 shadow-md"
            >
              Undo
            </button>
          </div>

          <div className="bg-gray-800 p-4 rounded-md border border-gray-700 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-yellow-400">Live Count Status</h2>
            </div>
            <p className="text-lg mb-4">Current Round: <span className="font-bold text-yellow-300 text-2xl ml-4">{roundNumber}</span></p>
            <p className="text-lg mb-4">Hi-Lo Running Count: <span className="font-bold text-indigo-300 text-2xl ml-4">{runningCount}</span></p>
            <p className="text-lg mb-4">Cards Played: <span className="font-bold text-indigo-300 text-2xl ml-4">{cardsPlayed}</span></p>
            <p className="text-lg mb-4">True Count: <span className="font-bold text-indigo-300 text-3xl ml-4">{trueCount.toFixed(2)}</span></p>
          </div>

          {trueCount >= 2 && (
            <div className="bg-green-700 p-4 rounded-lg mb-4 animate-pulse">
              <p className="text-2xl font-bold text-center">Winning Opportunity! Bet Big!</p>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">Card Counts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-0">
              {Object.entries(cardCounts).map(([card, count]) => {
                let cardColorClass = 'bg-gray-700';
                if (['2', '3', '4', '5', '6'].includes(card)) {
                  cardColorClass = 'bg-green-700'; // Positive cards
                } else if (['7', '8', '9'].includes(card)) {
                  cardColorClass = 'bg-blue-700'; // Neutral cards
                } else if (['10', 'J', 'Q', 'K', 'A'].includes(card)) {
                  cardColorClass = 'bg-red-700'; // Negative cards
                }
                return (
                  <div key={card} className={`rounded-lg px-0 py-0 flex items-center justify-center shadow-lg transition-shadow hover:shadow-xl ${cardColorClass}`}>
                    <span className="text-xs font-bold text-white">{card}&nbsp;=&nbsp;</span>
                    <span className={`text-xs font-bold ${
                      count === 0
                        ? 'text-pink-500'
                        : count === 1
                        ? 'text-green-300'
                        : count === 2
                        ? 'text-green-400'
                        : count === 3
                        ? 'text-green-500'
                        : count === 4
                        ? 'text-green-600'
                        : count === 5
                        ? 'text-green-700'
                        : count > 5
                        ? 'text-red-500'
                        : 'text-blue-400'
                    }`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Configuration, Hand Analysis & Strategy */}
        <div className="w-2/3 bg-gray-900 p-6 rounded-lg shadow-xl flex flex-col space-y-6 border border-gray-700 overflow-y-auto">
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">Game Setup</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="shoeSize" className="block text-sm font-medium text-gray-300">Shoe Size (decks):</label>
                <input
                  type="number"
                  id="shoeSize"
                  min="1"
                  max="8"
                  value={shoeSize}
                  onChange={(e) => setShoeSize(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                />
              </div>
              <div>
                <label htmlFor="penetration" className="block text-sm font-medium text-gray-300">Penetration (%):</label>
                <input
                  type="number"
                  id="penetration"
                  min="0"
                  max="100"
                  value={penetration}
                  onChange={(e) => setPenetration(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">Betting Parameters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="baseBet" className="block text-sm font-medium text-gray-300">Base Bet:</label>
                <input
                  type="number"
                  id="baseBet"
                  min="1"
                  value={baseBet}
                  onChange={(e) => setBaseBet(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                />
              </div>
              <div>
                <label htmlFor="bankroll" className="block text-sm font-medium text-gray-300">Bankroll:</label>
                <input
                  type="number"
                  id="bankroll"
                  min="1"
                  value={bankroll}
                  onChange={(e) => setBankroll(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                />
              </div>
              <div>
                <label htmlFor="minBet" className="block text-sm font-medium text-gray-300">Min Bet:</label>
                <input
                  type="number"
                  id="minBet"
                  min="1"
                  value={minBet}
                  onChange={(e) => setMinBet(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                />
              </div>
              <div>
                <label htmlFor="maxBet" className="block text-sm font-medium text-gray-300">Max Bet:</label>
                <input
                  type="number"
                  id="maxBet"
                  min="1"
                  value={maxBet}
                  onChange={(e) => setMaxBet(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">Current Hand</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="playerCard1" className="block text-sm font-medium text-gray-300">Player Card 1:</label>
                <select
                  id="playerCard1"
                  value={playerCard1}
                  onChange={(e) => setPlayerCard1(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                >
                  <option value="">Select Card</option>
                  {cardValues.map(card => <option key={card} value={card}>{card}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="playerCard2" className="block text-sm font-medium text-gray-300">Player Card 2:</label>
                <select
                  id="playerCard2"
                  value={playerCard2}
                  onChange={(e) => setPlayerCard2(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                >
                  <option value="">Select Card</option>
                  {cardValues.map(card => <option key={card} value={card}>{card}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="dealerUpcard" className="block text-sm font-medium text-gray-300">Dealer Upcard:</label>
                <select
                  id="dealerUpcard"
                  value={dealerUpcard}
                  onChange={(e) => setDealerUpcard(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 box-border"
                >
                  <option value="">Select Card</option>
                  {cardValues.map(card => <option key={card} value={card}>{card}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-md border border-gray-700 flex-grow flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold mb-4 text-green-400">Suggested Move:</h3>
            <p className="text-5xl font-extrabold text-green-300 mb-6 animate-pulse">
              {getSuggestedMove()}
            </p>
            <h3 className="text-xl font-bold mb-2 text-blue-400">Bet Size Recommendation:</h3>
            <p className="text-4xl font-bold text-blue-300 mb-6">
              {getBetSizeRecommendation()}
            </p>
            <h3 className="text-xl font-bold mb-2 text-purple-400">Winning %:</h3>
            <p className="text-4xl font-bold text-purple-300">
              {getWinRateProbability()}
            </p>
          </div>

          {/* Basic Strategy Chart in Middle Panel */}
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700 flex-grow">
            <h2 
              className="text-xl font-bold mb-4 text-gray-300 cursor-pointer hover:text-white transition-colors duration-200"
              onClick={() => setShowBasicStrategy(!showBasicStrategy)}
            >
              Basic Strategy Chart {showBasicStrategy ? '▼' : '►'}
            </h2>
            {showBasicStrategy && (
              <>
                <h4 className="text-md font-bold mb-2 text-gray-400">Hard Totals</h4>
                <table className="w-full text-sm text-left text-gray-400 mb-6 bg-gray-700 rounded-md overflow-hidden">
                  <thead className="text-xs text-gray-300 uppercase bg-gray-600">
                    <tr>
                      <th scope="col" className="py-2 px-2">Player Hand</th>
                      <th scope="col" className="py-2 px-2">Dealer Upcard</th>
                      <th scope="col" className="py-2 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basicStrategy.hardTotals.map((row, index) => (
                      <tr key={index} className="bg-gray-700 border-b border-gray-600 last:border-b-0">
                        <td className="py-2 px-2">{row.player}</td>
                        <td className="py-2 px-2">{row.dealer}</td>
                        <td className="py-2 px-2">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h4 className="text-md font-bold mb-2 text-gray-400">Soft Totals</h4>
                <table className="w-full text-sm text-left text-gray-400 mb-6 bg-gray-700 rounded-md overflow-hidden">
                  <thead className="text-xs text-gray-300 uppercase bg-gray-600">
                    <tr>
                      <th scope="col" className="py-2 px-2">Player Hand</th>
                      <th scope="col" className="py-2 px-2">Dealer Upcard</th>
                      <th scope="col" className="py-2 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basicStrategy.softTotals.map((row, index) => (
                      <tr key={index} className="bg-gray-700 border-b border-gray-600 last:border-b-0">
                        <td className="py-2 px-2">{row.player}</td>
                        <td className="py-2 px-2">{row.dealer}</td>
                        <td className="py-2 px-2">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h4 className="text-md font-bold mb-2 text-gray-400">Pairs</h4>
                <table className="w-full text-sm text-left text-gray-400 mb-6 bg-gray-700 rounded-md overflow-hidden">
                  <thead className="text-xs text-gray-300 uppercase bg-gray-600">
                    <tr>
                      <th scope="col" className="py-2 px-2">Player Hand</th>
                      <th scope="col" className="py-2 px-2">Dealer Upcard</th>
                      <th scope="col" className="py-2 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basicStrategy.pairs.map((row, index) => (
                      <tr key={index} className="bg-gray-700 border-b border-gray-600 last:border-b-0">
                        <td className="py-2 px-2">{row.player}</td>
                        <td className="py-2 px-2">{row.dealer}</td>
                        <td className="py-2 px-2">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BlackjackAnalyzer;
