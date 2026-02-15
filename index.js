const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8gmleuq.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Online learning platform server is running");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("OnlineLearningPlatform");
    const coursesCollection = db.collection("courses");
    const myCourses = db.collection("my_courses");
    const enrolledCourses = db.collection("enrolled_courses");
    const instructorsCollection = db.collection("instructor");

    // Users Apis
    app.get("/courses", async (req, res) => {
      const cursor = coursesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/add-course", async (req, res) => {
      console.log("headers in the post ", req.headers);
      const newProduct = req.body;
      const result = await myCourses.insertOne(newProduct);
      res.send(result);
    });

    app.post("/add-enrollment-course", async (req, res) => {
      const newEnroll = req.body;
      const result = await enrolledCourses.insertOne(newEnroll);
      res.send(result);
    });

    app.get("/my-enrollment", async (req, res) => {
      const email = req.query.email;
      const result = await enrolledCourses.find({ email }).toArray();
      res.send(result);
    });

    app.get("/my-courses", async (req, res) => {
      const email = req.query.email;
      const result = await myCourses.find({ email }).toArray();
      res.send(result);
    });

    app.get("/my-courses/:id", async (req, res) => {
      const id = req.params.id;
      const result = await myCourses.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
