const spellcheck = require('./spellcheck'); // Import the function
const express = require("express");
const path = require("path");
const bodyParser= require("body-parser");
const { log } = require('console');

const app = express();
const port = 3000;

const publicDirectoryPath = path.join(__dirname,"/public");
const viewsPath = path.join(__dirname, "/views");


app.set("view engine","hbs");
app.set("views", viewsPath);
app.use(express.static(publicDirectoryPath));
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/",(req,res)=>{
  res.render("index");
})

app.post("/post", (req,res)=>{
  const text = req.body.textArea;
  let correctedText="abc";
  spellcheck(text, (error, data) => {
    if (error) {
      res.render("index",{correction: "Please enter something"});
    } else {
      // Now you have the response data from the API in 'data'
      correctedText = replaceWithBestCandidate(data);
      res.render("index",{correction: correctedText});
    }
  });
});


// Function to replace text with best_candidate
function replaceWithBestCandidate(data) {
    let updatedText = data.original_text;
  
    data.corrections.forEach(correction => {
      const { text, best_candidate } = correction;
      // Replace the text with the best_candidate
      updatedText = updatedText.replace(text, best_candidate);
    });
  
    return updatedText;
}


app.listen(port, () => {
  console.log("Server is up on port " + port);
});