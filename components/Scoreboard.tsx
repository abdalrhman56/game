import React, { useState, useEffect } from 'react';
import { Player, PlayerId, GameType, ScoreTransaction } from '../types';
import { GAME_DEFINITIONS, INITIAL_PLAYERS } from '../constants';
import { Plus, Undo2, Crown, Diamond, Users, Layers, Trophy, Calculator, Settings, Save, X, Share2, Link as LinkIcon, Copy, CheckCircle2 } from 'lucide-react';

const Scoreboard: React.FC = () => {
  // State
  const [players, setPlayers] = useState<Player[]>(
    INITIAL_PLAYERS.map((name, i) => ({ id: i as PlayerId, name, score: 0 }))
  );
  const [history, setHistory] = useState<ScoreTransaction[]>([]);
  const [isAddingScore, setIsAddingScore] = useState(false);
  
  // Player Name Editing State
  const [isEditingPlayers, setIsEditingPlayers] = useState(false);
  const [tempNames, setTempNames] = useState<{ [key in PlayerId]: string }>({ 0: '', 1: '', 2: '', 3: '' });

  // Multiplayer / Sharing State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);

  // New Transaction Form State
  const [selectedGame, setSelectedGame] = useState<GameType>(GameType.QUEENS);
  const [inputs, setInputs] = useState<{ [key in PlayerId]: number }>({ 0: 0, 1: 0, 2: 0, 3: 0 });

  // Helpers
  const gameDef = GAME_DEFINITIONS[selectedGame];

  // --- Effect: Load Game from URL if present ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
        try {
            // Defensive fix: replace spaces with + in case URL decoding messed up base64
            const safeBase64 = data.replace(/ /g, '+');
            // Fix: Use decodeURIComponent + escape to handle Arabic/Unicode characters from base64
            const jsonString = decodeURIComponent(escape(atob(safeBase64)));
            const decoded = JSON.parse(jsonString);
            
            if (decoded.players && decoded.history) {
                setPlayers(decoded.players);
                setHistory(decoded.history);
                // Clean URL after loading to avoid refreshing into old state later
                window.history.replaceState({}, '', window.location.pathname);
            }
        } catch (e) {
            console.error("Failed to load game data", e);
        }
    }
  }, []);

  // --- Multiplayer Logic ---
  const generateShareLink = () => {
     const gameState = { players, history };
     // Fix: Use unescape + encodeURIComponent to handle Arabic/Unicode characters for base64
     const jsonString = JSON.stringify(gameState);
     const base64 = btoa(unescape(encodeURIComponent(jsonString)));
     // CRITICAL: Encode the base64 string so '+' and '/' don't break in URL params
     const safeData = encodeURIComponent(base64);
     
     const url = `${window.location.origin}${window.location.pathname}?data=${safeData}`;
     return url;
  };

  const generateRoomCode = () => {
      // Simulate a room code based on timestamp (last 4 chars base36)
      return Math.floor(Date.now() / 1000).toString(36).slice(-4).toUpperCase();
  };

  const handleOpenShare = () => {
      if (!roomCode) setRoomCode(generateRoomCode());
      setIsShareModalOpen(true);
      setCopied(false);
  };

  const copyToClipboard = async () => {
      const link = generateShareLink();
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy!', err);
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            alert("Could not copy automatically. Please manually copy the link below.");
        }
        document.body.removeChild(textArea);
      }
  };

  const handleInputChange = (playerId: PlayerId, value: string) => {
    const val = parseInt(value) || 0;
    setInputs(prev => ({ ...prev, [playerId]: val }));
  };

  const validateInputs = (): boolean => {
    if (selectedGame === GameType.TRIX) {
        // Trix requires distinct ranks 1, 2, 3, 4
        const values = Object.values(inputs);
        const unique = new Set(values);
        if (values.some(v => v < 1 || v > 4)) return false;
        if (unique.size !== 4) return false;
        return true;
    }
    
    // For other games, sum of items must equal total items
    const totalItems = Object.values(inputs).reduce((a, b) => a + b, 0);
    return totalItems === (gameDef.maxItems || 0);
  };

  const submitScore = () => {
    if (!validateInputs()) {
        alert("Invalid input! Check card counts or ranks.");
        return;
    }

    const transactionScores: { [key in PlayerId]: number } = { 0: 0, 1: 0, 2: 0, 3: 0 };
    
    players.forEach(p => {
        let points = 0;
        const inputVal = inputs[p.id];
        
        if (selectedGame === GameType.TRIX) {
            // Rank to points map
            const trixPoints = { 1: 200, 2: 150, 3: 100, 4: 50 };
            points = trixPoints[inputVal as 1|2|3|4] || 0;
        } else {
            points = inputVal * gameDef.scoreUnit;
        }
        transactionScores[p.id] = points;
    });

    // Update History
    const newTransaction: ScoreTransaction = {
        id: Date.now().toString(),
        gameType: selectedGame,
        scores: transactionScores,
        timestamp: Date.now()
    };
    
    setHistory([...history, newTransaction]);
    
    // Update Totals
    setPlayers(prev => prev.map(p => ({
        ...p,
        score: p.score + transactionScores[p.id]
    })));

    setIsAddingScore(false);
    setInputs({ 0: 0, 1: 0, 2: 0, 3: 0 }); // Reset
  };

  const undoLast = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    
    setPlayers(prev => prev.map(p => ({
        ...p,
        score: p.score - last.scores[p.id]
    })));
    
    setHistory(prev => prev.slice(0, -1));
  };

  const startEditingPlayers = () => {
    const currentNames = players.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {} as { [key in PlayerId]: string });
    setTempNames(currentNames);
    setIsEditingPlayers(true);
  };

  const savePlayerNames = () => {
    setPlayers(prev => prev.map(p => ({
      ...p,
      name: tempNames[p.id].trim() || INITIAL_PLAYERS[p.id] // Default to initial if empty
    })));
    setIsEditingPlayers(false);
  };

  const getIcon = (type: GameType) => {
      switch(type) {
          case GameType.KING: return <Crown size={16} />;
          case GameType.DIAMONDS: return <Diamond size={16} />;
          case GameType.QUEENS: return <Users size={16} />;
          case GameType.COLLECTION: return <Layers size={16} />;
          case GameType.TRIX: return <Trophy size={16} />;
      }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {players.map(player => (
            <div key={player.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center relative overflow-hidden shadow-lg group">
                <div className={`absolute top-0 left-0 w-full h-1 ${player.score > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <div className="flex items-center gap-1 w-full justify-center mb-1">
                   <span className="text-slate-400 text-sm font-medium truncate text-center">{player.name}</span>
                </div>
                <span className={`text-3xl font-bold font-mono ${player.score > 0 ? 'text-emerald-400' : player.score < 0 ? 'text-red-400' : 'text-white'}`}>
                    {player.score}
                </span>
            </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex gap-4 mb-6">
        <button 
            onClick={() => setIsAddingScore(true)}
            className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/20"
        >
            <Plus size={20} /> <span className="hidden sm:inline">Add Round</span><span className="sm:hidden">Add</span>
        </button>
        <button 
            onClick={handleOpenShare}
            className="flex-none bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition border border-indigo-500 shadow-lg shadow-indigo-900/20"
            title="Play with Friends"
        >
            <Share2 size={20} />
        </button>
        <button 
            onClick={undoLast}
            disabled={history.length === 0}
            className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
        >
            <Undo2 size={20} /> <span className="hidden sm:inline">Undo</span>
        </button>
        <button 
            onClick={startEditingPlayers}
            className="flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition border border-slate-700"
            title="Edit Player Names"
        >
            <Settings size={20} />
        </button>
      </div>

      {/* History Feed */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 min-h-[200px]">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calculator size={14} /> Game Log
          </h3>
          {history.length === 0 ? (
              <div className="text-center text-slate-600 py-8">No games played yet. Start a round!</div>
          ) : (
              <div className="space-y-2">
                  {[...history].reverse().map(tx => (
                      <div key={tx.id} className="bg-slate-800 p-3 rounded-lg flex items-center justify-between border border-slate-700/50">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-700 rounded-full text-slate-300">
                                  {getIcon(tx.gameType)}
                              </div>
                              <div>
                                  <span className="block text-white text-sm font-semibold">{GAME_DEFINITIONS[tx.gameType].label}</span>
                                  <span className="text-xs text-slate-400">
                                    {GAME_DEFINITIONS[tx.gameType].arabicLabel}
                                  </span>
                              </div>
                          </div>
                          <div className="flex gap-4 text-xs font-mono">
                                {Object.entries(tx.scores).map(([pid, score]) => (
                                    <div key={pid} className="flex flex-col items-center">
                                        <span className="text-slate-500">{players[parseInt(pid)].name.split(' ')[0]}</span>
                                        <span className={score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-slate-400'}>
                                            {score > 0 ? '+' : ''}{score}
                                        </span>
                                    </div>
                                ))}
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Add Score Modal Overlay */}
      {isAddingScore && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Record Round Result</h3>
                    <button onClick={() => setIsAddingScore(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    {/* Game Selector */}
                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {(Object.values(GAME_DEFINITIONS) as any[]).map((def) => (
                            <button 
                                key={def.type}
                                onClick={() => {
                                    setSelectedGame(def.type);
                                    setInputs({ 0: 0, 1: 0, 2: 0, 3: 0 }); // Reset inputs on game change
                                }}
                                className={`flex flex-col items-center p-2 rounded-lg transition ${selectedGame === def.type ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                            >
                                {selectedGame === def.type ? getIcon(def.type) : getIcon(def.type)}
                                <span className="text-[10px] mt-1 font-bold">{def.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg mb-6 text-center">
                        <h4 className="text-emerald-400 font-bold text-lg mb-1">{gameDef.label} ({gameDef.arabicLabel})</h4>
                        <p className="text-sm text-slate-300">{gameDef.description}</p>
                        {selectedGame !== GameType.TRIX && (
                             <p className="text-xs text-slate-500 mt-2">Total Items: {gameDef.maxItems}</p>
                        )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        {players.map(player => (
                            <div key={player.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                                <span className="font-medium text-slate-200">{player.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 uppercase mr-2">
                                        {selectedGame === GameType.TRIX ? 'Rank (1-4)' : 'Count'}
                                    </span>
                                    <input 
                                        type="number" 
                                        min="0"
                                        max={selectedGame === GameType.TRIX ? 4 : gameDef.maxItems}
                                        value={inputs[player.id]}
                                        onChange={(e) => handleInputChange(player.id, e.target.value)}
                                        className="w-16 bg-slate-900 border border-slate-600 rounded p-2 text-center text-white font-mono focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Validation Error Hint */}
                    {!validateInputs() && (
                        <p className="text-red-400 text-xs text-center mt-4">
                            {selectedGame === GameType.TRIX 
                                ? "Ranks must be unique (1, 2, 3, 4)." 
                                : `Total counts must equal ${gameDef.maxItems}.`}
                        </p>
                    )}

                    <button 
                        onClick={submitScore}
                        disabled={!validateInputs()}
                        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition shadow-lg"
                    >
                        Save Round
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Edit Names Modal */}
      {isEditingPlayers && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users size={18} /> Edit Players
                    </h3>
                    <button onClick={() => setIsEditingPlayers(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-400 mb-4">Enter player names. Leave blank to reset to default.</p>
                    {players.map(player => (
                        <div key={player.id} className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase font-bold ml-1">Player {player.id + 1}</label>
                            <input 
                                type="text"
                                value={tempNames[player.id]}
                                onChange={(e) => setTempNames(prev => ({...prev, [player.id]: e.target.value}))}
                                placeholder={INITIAL_PLAYERS[player.id]}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>
                    ))}

                    <button 
                        onClick={savePlayerNames}
                        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> Save Names
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Share / Multiplayer Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Share2 size={18} /> Multiplayer Setup
                    </h3>
                    <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Intro */}
                    <div className="text-center space-y-1">
                        <h4 className="text-emerald-400 font-bold">اللعب مع الأصدقاء (Play with Friends)</h4>
                        <p className="text-xs text-slate-400">
                            Share the current game state via link or code.<br/>
                            <span className="opacity-75">Send this link to friends so they can see the scoreboard.</span>
                        </p>
                    </div>

                    {/* Room Code Section */}
                    <div className="bg-slate-700/30 p-4 rounded-xl text-center border border-slate-700">
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Room Code</span>
                        <div className="text-4xl font-mono font-bold text-white my-2 tracking-widest">{roomCode}</div>
                        <p className="text-[10px] text-slate-500">Virtual ID for this session</p>
                    </div>

                    {/* Link Section */}
                    <div className="space-y-2">
                         <label className="text-xs text-slate-500 uppercase font-bold ml-1">Invite Link</label>
                         <div className="flex gap-2">
                             <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 text-xs truncate font-mono select-all">
                                {generateShareLink()}
                             </div>
                             <button 
                                onClick={copyToClipboard}
                                className={`px-4 rounded-lg flex items-center justify-center transition ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                             >
                                 {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                             </button>
                         </div>
                         {copied && <p className="text-emerald-500 text-xs text-center">Link copied! Send it to your friends.</p>}
                    </div>

                    <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-900/50">
                        <div className="flex gap-2 items-start">
                             <LinkIcon size={16} className="text-blue-400 mt-1 shrink-0" />
                             <p className="text-xs text-blue-200">
                                 <strong>Tip:</strong> Any player can update the score and send a new link back to the group to update everyone's view.
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;