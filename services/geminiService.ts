
import { GoogleGenAI } from "@google/genai";
import { TripData, CalculationResult } from "../types";
import { TRANSPORT_LABELS } from "../constants";

export const getTravelInsights = async (trip: TripData, result: CalculationResult): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analise o seguinte impacto ambiental de uma viagem:
    - Origem: ${trip.origin}
    - Destino: ${trip.destination}
    - Meio de Transporte: ${TRANSPORT_LABELS[trip.mode]}
    - Distância: ${trip.distance} km
    - Passageiros: ${trip.passengers}
    - Emissão Total de CO2: ${result.co2Kg.toFixed(2)} kg
    - Árvores necessárias para compensar (em 1 ano): ${result.treesNeeded.toFixed(1)}
    
    Por favor, forneça em Português do Brasil:
    1. Uma breve análise sobre a eficiência deste meio de transporte para esta distância.
    2. Duas alternativas mais sustentáveis (se existirem).
    3. Uma curiosidade interessante sobre o impacto ambiental dessa rota.
    4. Dicas curtas de como tornar essa viagem específica mais "verde".
    
    Mantenha o tom encorajador e educativo. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar dicas automáticas no momento.";
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return "Erro ao carregar insights ambientais. Por favor, tente novamente.";
  }
};
