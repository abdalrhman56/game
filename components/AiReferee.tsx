import React, { useState, useRef, useEffect } from 'react';
import { askReferee } from '../services/geminiService';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const AiReferee: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello! I am your Trix Referee. Ask me about rules, strategy, or scoring disputes. I can also explain the script provided!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await askReferee(userMsg);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] max-w-2xl mx-auto bg-slate-900 md:border md:border-slate-700 md:rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center gap-2">
        <Bot className="text-emerald-400" />
        <h2 className="font-bold text-white">AI Referee</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-700'}`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap ${
                    m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}>
                    {m.text}
                </div>
            </div>
        ))}
        {loading && (
            <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                </div>
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                    <Loader2 size={16} className="animate-spin text-emerald-500" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about a rule..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
        />
        <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-lg transition"
        >
            <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AiReferee;
