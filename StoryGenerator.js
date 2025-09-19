import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export  const generateStory = async (prompt) => {

      try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `You are an expert children's story writer. Create a fun, simple, and engaging story for kids based on the following input: ${prompt}`);

    return result.response.text();
  } catch (error) {

        console.log(`Gemini overloaded ${error.message}`);
 


  }
}


generateStory();

