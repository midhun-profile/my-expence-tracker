
import { GoogleGenAI, Type } from "@google/genai";
import { Expense } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSpendingInsights = async (expenses: Expense[]) => {
  if (expenses.length === 0) return null;

  const expenseSummary = expenses.map(e => ({
    amount: e.amount,
    category: e.category,
    description: e.description,
    date: e.date
  }));

  const prompt = `
    Analyze these expenses and provide financial insights:
    ${JSON.stringify(expenseSummary)}
    
    Return a professional financial analysis focusing on:
    1. Where the most money is being spent.
    2. Any unusual patterns or potential savings.
    3. Actionable advice to save more this month.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: 'A detailed summary of spending habits' },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'List of actionable financial tips'
            }
          },
          required: ['analysis', 'recommendations']
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};
