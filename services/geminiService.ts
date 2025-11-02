import { GoogleGenAI } from "@google/genai";

export const getCountyFromCoords = async (lat: number, lon: number): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Based on the latitude ${lat} and longitude ${lon}, what is the county? Please provide only the county name and nothing else. For example: 'Los Angeles County'`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const county = response.text.trim();
    if (!county) {
        throw new Error("Failed to determine county from Gemini API response.");
    }
    return county;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not determine county. Please try again.");
  }
};

export const getMilesBetweenLocations = async (start: string, end: string): Promise<number> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `What is the driving distance in miles between "${start}" and "${end}"? Please provide only the number, with up to one decimal place. For example: 42.5`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const distanceText = response.text.trim();
    const distance = parseFloat(distanceText);

    if (isNaN(distance)) {
      throw new Error("Could not parse a valid distance from the response.");
    }
    
    return distance;
  } catch (error) {
    console.error("Error calling Gemini API for mileage:", error);
    throw new Error("Could not calculate mileage. Please check locations and try again.");
  }
};
