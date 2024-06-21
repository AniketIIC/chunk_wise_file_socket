import express from "express";
import cors from "cors";
import multer from "multer";
import Busboy from "busboy";

const app = express();

app.use(cors("*"));

const upload = multer();

app.post("/test", upload.single("file"), (req, res, next) => {
  const file = req.file;
  console.log("file is: ", file);
  return res.sendStatus(200);
});

app.post("/test-2", (req, res) => {});

const server = app.listen(3000, () => {
  console.log("App listening on port 3000");
});

//server.timeout = 0
