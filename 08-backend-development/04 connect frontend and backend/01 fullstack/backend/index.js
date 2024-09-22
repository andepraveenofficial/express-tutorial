import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.static("dist"));

// 00 Home

/*  
app.get("/", (req, res) => {
    console.log("Home")
    res.send("Home")
})
*/

// 02 Jokes
app.get("/api/jokes", (req, res) => {
  console.log("Jokes");

  const jokes = [
    {
      id: 1,
      title: "A First Joke",
      content: "This First Joke",
    },
    {
      id: 2,
      title: "A Second Joke",
      content: "This Second Joke",
    },
    {
      id: 3,
      title: "A Third Joke",
      content: "This Third Joke",
    },
    {
      id: 4,
      title: "A Fourth Joke",
      content: "This Fourth Joke",
    },
    {
      id: 5,
      title: "A Fifth Joke",
      content: "This Fifth Joke",
    },
  ];

  res.send(jokes);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
