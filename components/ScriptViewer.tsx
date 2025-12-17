import React from 'react';
import { MessageCircle, User, Users } from 'lucide-react';

const ScriptViewer: React.FC = () => {
  const scriptLines = [
    { type: "divider", text: "المشهد الأول: بداية اللعبة" },
    { type: "action", text: "الراوي: اجتمع أربعة أصدقاء حول الطاولة للعب لعبة التركس، وكل واحد منهم متحمّس للفوز." },
    { speaker: "أحمد", text: "جاهزين؟ خلّونا نبدأ، مين بيوزّع الورق؟" },
    { speaker: "سارة", text: "أنا أوزّع. إن شاء الله حظي يكون قوي اليوم." },
    { speaker: "خالد", text: "المهم لا تورّطونا بالهارت ولا بالكوينز 😅" },
    { speaker: "ليان", text: "يلا، نبدأ على بركة الله." },

    { type: "divider", text: "المشهد الثاني: شرح القواعد" },
    { speaker: "سارة", text: "خلّونا نتفق، نبدأ بعقد التركس." },
    { speaker: "أحمد", text: "تمام، اللي معه سبعة دينار هو اللي يبدأ." },
    { type: "action", text: "الراوي: ينظر اللاعبون في أوراقهم بترقّب لمعرفة من سيبدأ اللعب." },

    { type: "divider", text: "المشهد الثالث: اللعب" },
    { speaker: "خالد", text: "طلع معي 7♦، أنا ببدأ. (يضع الورقة على الطاولة)", highlight: true },
    { speaker: "ليان", text: "حلو، أنا عندي 8♦، بكمل السلسلة." },
    { speaker: "أحمد", text: "وأنا 6♦، بنزلها تحت." },
    { speaker: "سارة", text: "ما عندي دينار مناسب، بمرّر دوري." },

    { type: "divider", text: "المشهد الرابع: التحدي" },
    { speaker: "ليان", text: "انتبهوا، قربت أخلص أوراقي." },
    { speaker: "أحمد", text: "واضح أنك مخبّي ورق قوي!" },
    { speaker: "سارة", text: "لا تفرح بدري، اللعبة لسه طويلة." },

    { type: "divider", text: "المشهد الخامس: النهاية" },
    { type: "action", text: "الراوي: تستمر اللعبة، وكل لاعب يحاول التخلّص من أوراقه بأسرع وقت." },
    { speaker: "خالد", text: "هذه آخر ورقة عندي!", highlight: true },
    { speaker: "ليان", text: "معقول؟ خلصت؟" },
    { type: "action", text: "الراوي: وبهذا، ينتهي عقد التركس بفوز خالد، وسط ضحكات ومزاح الجميع." },
    { speaker: "الجميع", text: "مبروك! 👏", highlight: true }
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Roleplay Script</h2>
        <p className="text-slate-400">A structured dialogue scene for a Trix game session.</p>
      </div>

      <div className="space-y-4">
        {scriptLines.map((line, index) => {
          if (line.type === 'divider') {
            return (
              <div key={index} className="flex items-center justify-center mt-10 mb-6">
                 <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
                 <span className="text-emerald-400 font-bold px-4 text-sm md:text-base border border-slate-700 bg-slate-900/50 rounded-full py-1">
                    {line.text}
                 </span>
                 <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
              </div>
            );
          }

          if (line.type === 'action') {
            return (
              <div key={index} className="flex items-center justify-center my-4 px-8 text-center">
                <span className="text-slate-500 text-xs italic leading-relaxed">
                  {line.text}
                </span>
              </div>
            );
          }

          const isLeft = index % 2 === 0;
          const isEveryone = line.speaker === "الجميع";

          return (
            <div key={index} className={`flex gap-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${line.highlight ? 'bg-emerald-600' : 'bg-slate-700'} ${isEveryone ? 'bg-yellow-600' : ''}`}>
                {isEveryone ? <Users size={20} className="text-white" /> : <User size={20} className="text-white" />}
              </div>
              <div className={`flex flex-col max-w-[85%] ${isLeft ? 'items-start' : 'items-end'}`}>
                <span className="text-xs text-slate-500 mb-1 px-1">{line.speaker}</span>
                <div className={`p-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
                  line.highlight 
                    ? 'bg-emerald-900/40 border-emerald-500/30 border text-emerald-100' 
                    : isEveryone
                      ? 'bg-yellow-900/20 border-yellow-700/50 border text-yellow-100'
                      : 'bg-slate-800 border border-slate-700 text-slate-200'
                } ${isLeft ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
                  {line.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScriptViewer;