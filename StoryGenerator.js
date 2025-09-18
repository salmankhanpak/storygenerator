import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export  const generateStory = async (prompt) => {

      try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Write a short story about a rabbit in a garden:${prompt}`);
    console.log(result.response.text());
    return result.response.text();
  } catch (error) {

        console.log(`Gemini overloaded ${error.message}`);
 


  }
}


generateStory();
