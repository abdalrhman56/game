import React, { useState } from 'react';
import Scoreboard from './components/Scoreboard';
import Rules from './components/Rules';
import ScriptViewer from './components/ScriptViewer';
import AiReferee from './components/AiReferee';
import { Gamepad2, ScrollText, MessageSquareText, Bot } from 'lucide-react';

enum Tab {
  SCORE = 'SCORE',
  RULES = 'RULES',
  SCRIPT = 'SCRIPT',
  AI = 'AI'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SCORE);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold transform rotate-3">T</div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">Trix Master</h1>
          </div>
          
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab(Tab.SCORE)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === Tab.SCORE ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              Play
            </button>
            <button 
              onClick={() => setActiveTab(Tab.RULES)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === Tab.RULES ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              Rules
            </button>
            <button 
              onClick={() => setActiveTab(Tab.SCRIPT)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === Tab.SCRIPT ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              Script
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-20 pb-24 px-4">
        {activeTab === Tab.SCORE && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Creator Credits & Info Card */}
             <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-6 mb-8 border border-slate-700 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>
                
                <h2 className="text-3xl font-bold text-white mb-2">🃏 لعبة التركس (Trix)</h2>
                
                <div className="inline-block bg-slate-900/50 border border-slate-700 px-4 py-1 rounded-full mb-6">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-bold mr-2">إعداد وتصميم اللعبة</span>
                    <span className="text-emerald-400 font-bold">عبد الرحمن ابازيد</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm max-w-2xl mx-auto">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <strong className="text-slate-300 block mb-1">نوع اللعبة</strong>
                        <span className="text-slate-400">لعبة ورق – أربعة لاعبين</span>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <strong className="text-slate-300 block mb-1">وصف مختصر</strong>
                        <span className="text-slate-400">لعبة تعتمد على الذكاء والتخطيط، تلعب حسب توزيع الأوراق.</span>
                    </div>
                </div>
             </div>

             <Scoreboard />
          </div>
        )}
        {activeTab === Tab.RULES && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Rules />
          </div>
        )}
        {activeTab === Tab.SCRIPT && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScriptViewer />
           </div>
        )}
        {activeTab === Tab.AI && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
               <AiReferee />
            </div>
        )}
      </main>

      {/* Mobile Bottom Navigation (includes AI button) */}
      <div className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 md:hidden z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <button onClick={() => setActiveTab(Tab.SCORE)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.SCORE ? 'text-emerald-400' : 'text-slate-500'}`}>
            <Gamepad2 size={20} />
            <span className="text-[10px]">Play</span>
          </button>
          <button onClick={() => setActiveTab(Tab.RULES)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.RULES ? 'text-emerald-400' : 'text-slate-500'}`}>
            <ScrollText size={20} />
            <span className="text-[10px]">Rules</span>
          </button>
          <button onClick={() => setActiveTab(Tab.SCRIPT)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.SCRIPT ? 'text-emerald-400' : 'text-slate-500'}`}>
            <MessageSquareText size={20} />
            <span className="text-[10px]">Script</span>
          </button>
          <button onClick={() => setActiveTab(Tab.AI)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.AI ? 'text-emerald-400' : 'text-slate-500'}`}>
            <Bot size={20} />
            <span className="text-[10px]">AI Ref</span>
          </button>
        </div>
      </div>

       {/* Desktop AI Fab */}
       <button 
        onClick={() => setActiveTab(Tab.AI)}
        className="hidden md:flex fixed bottom-8 right-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-4 shadow-xl z-50 transition-transform hover:scale-110 items-center justify-center gap-2 group"
       >
         <Bot size={24} />
         <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">Ask AI Referee</span>
       </button>
    </div>
  );
};

export default App;