
import { GoogleGenAI } from "@google/genai";

export async function explainExpenses(numbers: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Atue como um especialista financeiro da LIBRAS77. 
      Analise os seguintes valores de gastos (em reais): ${numbers}. 
      1. Calcule o total. 
      2. Faça um breve comentário sobre o impacto desses gastos.
      3. Dê uma dica curta e prática de economia.
      Responda em Português do Brasil, de forma clara e profissional.`,
    });
    return response.text || "Desculpe, não consegui processar essa análise agora.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao tentar consultar o assistente de IA. Verifique sua chave de API.";
  }
}
