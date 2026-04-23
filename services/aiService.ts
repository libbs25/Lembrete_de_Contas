
import { GoogleGenAI } from "@google/genai";
import { Bill, AIPersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateCollectionMessage = async (bill: Bill, persona: AIPersona, userName: string) => {
  const prompt = `
    Você é um assistente virtual de cobrança ${persona === 'male' ? 'masculino' : 'feminino'}.
    Seu objetivo é criar uma mensagem educada, profissional mas firme para cobrar uma dívida atrasada.
    
    Dados da dívida:
    - Credor (quem está cobrando): ${userName}
    - Devedor: ${bill.name}
    - Valor: R$ ${bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    - Referente a: ${bill.description || 'Serviços/Produtos'}
    - Data de vencimento original: ${new Date(bill.dueDate).toLocaleDateString('pt-BR')}
    
    Instruções:
    1. A mensagem deve ser curta e direta para WhatsApp.
    2. Use um tom ${persona === 'male' ? 'objetivo e profissional' : 'amigável mas assertivo'}.
    3. Mencione que você está entrando em contato em nome de ${userName}.
    4. Não use emojis em excesso.
    5. Peça para a pessoa entrar em contato para regularizar.
    
    Retorne APENAS o texto da mensagem.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating message:", error);
    return `Olá, estou entrando em contato em nome de ${userName} referente ao pagamento de R$ ${bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${bill.description || 'Serviços'}) que venceu em ${new Date(bill.dueDate).toLocaleDateString('pt-BR')}. Por favor, entre em contato para regularizar.`;
  }
};
