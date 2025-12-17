import React from 'react';
import { ScrollText, ShieldAlert, Zap } from 'lucide-react';

const Rules: React.FC = () => {
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 pb-24 text-gray-100">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
          <ScrollText /> قوانين لعبة التركس (Trix Rules)
        </h2>
        
        <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-300">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h3 className="font-bold text-white mb-2">الملخص (Summary)</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>اللاعبين:</strong> 4 لاعبين (غالبًا فريقين: 2 ضد 2 أو فردي).</li>
              <li><strong>الورق:</strong> 52 ورقة (Standard Deck).</li>
              <li><strong>النظام:</strong> اللعبة تنقسم لمرحلتين شائعتين (ممالك/عقود).</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               مرحلة العقود (Kingdoms)
            </h3>
            <p className="mb-2">في كل جولة يختار "الملك" عقدًا. الهدف إما تجنب الورق السلبي أو التخلص من الورق (تركس).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-red-900/20 border border-red-900/50 p-3 rounded">
                <strong className="text-red-400 block">1. الكيش (Tricks/Latshat)</strong>
                <span className="text-xs">تجنب أخذ اللطشات. كل لطشة = -15 نقطة.</span>
              </div>
              <div className="bg-red-900/20 border border-red-900/50 p-3 rounded">
                <strong className="text-red-400 block">2. الدينار (Diamonds)</strong>
                <span className="text-xs">تجنب الديناري. كل ♦ = -10 نقاط.</span>
              </div>
              <div className="bg-red-900/20 border border-red-900/50 p-3 rounded">
                <strong className="text-red-400 block">3. بنات (Queens)</strong>
                <span className="text-xs">تجنب الملكات. كل Q = -25 نقطة.</span>
              </div>
              <div className="bg-red-900/20 border border-red-900/50 p-3 rounded">
                <strong className="text-red-400 block">4. شيخ الكبة (King of Hearts)</strong>
                <span className="text-xs">تجنب K♥. تساوي -75 نقطة!</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 mt-6">
              <Zap className="text-yellow-400" /> عقد التركس (Trix)
            </h3>
            <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg">
              <p className="mb-2"><strong>الهدف:</strong> تتخلّص من أوراقك بوضعها على الطاولة وفق تسلسل.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>يبدأ اللعب بـ <span className="text-yellow-400 font-bold">7♦</span> (إجباري لمن يملكها).</li>
                <li>يتم بناء السلاسل <strong>تصاعديًا أو تنازليًا</strong> (مثلاً: 6♦ ثم 5♦... أو 8♦ ثم 9♦...).</li>
                <li>كل نوع (♠ ♥ ♦ ♣) له سلسلة خاصة.</li>
                <li><strong>النقاط:</strong> الأول (+200)، الثاني (+150)، الثالث (+100)، الرابع (+50).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
