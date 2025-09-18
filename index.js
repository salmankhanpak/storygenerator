import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Book from "./Story.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { generateStory } from "./StoryGenerator.js";
import { ConnectMongoDB } from "./mongodbcon.js";
import multer from "multer";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
ConnectMongoDB();

// test
app.get("/test", (req, res) => {
  res.send("Server running successfully");
});

//  route
// app.use("/story", StoryRoute);
const storage = multer.memoryStorage();
const upload = multer({ storage });
// for upload route 
app.post("/story/upload", upload.single("file"),
async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const { name } = req.body;

    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
      .promise;
    const totalPages = pdf.numPages;
    const stories = [];
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item) => item.str).join(" ");
      try {
        const story = await generateStory(text);
        if (story) {
          stories.push(story);
        } else {
          stories.push(null);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    if (stories.length == 0) {
      return res
        .status(400)
        .json({ message: "no stories upload please upload again" });
    }
    const newBook = new Book({
      name: name || originalname,
      pages: totalPages,
   
      stories: stories,
    });

    // Save to story to database
    await newBook.save();

    res.status(201).json({
      message: "File uploaded successfully",
      id: newBook.id,
      Name: newBook.name,
      Pages: newBook.pages,
      Stories: newBook.stories,
    });
  } catch (error) {
    console.error("Error saving file:", error);
    res
      .status(500)
      .json({ message: "Error saving file", error: error.message });
  }
}

);

app.get("/story",async(req,res)=>{
    try{
const Story=await Book.find();
if(!Story){
  res.status(200).json({message:"Books are not found please upload a book "})  
}
res.status(200).json({Story})
    }
    catch(error){
        res.status(500).json({message:'Not found'})
    }
} );
app.get("/story/:_id",async(req,res)=>{
    const id=req.params;
    try{
const Story=await Book.findById(id);
if(!Story){
  res.status(404).json({message:"Book not Found"})  
}
res.status(200).json({Story})
    }
    catch(error){
        res.status(500).json({message:'Not found'})
    }
} )



app.listen(8080, () => {
  console.log("App is listening on port 5050");
});


