import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const TRIX_SYSTEM_PROMPT = `
You are the "Trix Master Referee". You are an expert in the Middle Eastern card game Trix (Trexs).
Your goal is to explain rules, settle disputes, and clarify scoring based on standard "Complex Trix" (Kingdoms) rules.

Key Rules Context:
1. 4 Players, 52 Cards.
2. 5 Contracts (Games): King of Hearts (-75), Queens (-25 each), Diamonds (-10 each), Latshat/Collection (-15 each), Trix (Positive points: 200, 150, 100, 50).
3. In Trix contract: Start with 7 of Diamonds or Jack depending on variation, but assume standard 7 start unless user specifies.
4. If asked about strategy, give tips.
5. Be concise and friendly. You can use Arabic terms (Latsh, Sheikh al Kobba) if helpful.
6. The user has a web app with a Scoreboard, Rules, and Script section.

If the user asks about the script provided in their context, explain it's a roleplay example of a game starting.
`;

export const askReferee = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key is missing. Please check your configuration.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: TRIX_SYSTEM_PROMPT,
      }
    });
    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The Referee is currently unavailable (API Error).";
  }
};
