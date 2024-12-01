const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
var cors = require("cors");
const app = express();
const port = 5000;
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://bike-store-backend:S0H81Yn2fkFwgdDJ@cluster0.urino.mongodb.net/bikeStoreDB?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db().collection("user");
    const productCollection = client.db().collection("products");
    const orderCollection = client.db().collection("orders");
    const serviceCollection = client.db().collection("bikeservices");
    //User Authentication starts here
    app.post("/signup", async (req, res) => {
      const { name, img, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = {
        name,
        img,
        email,
        password: hashedPassword,
      };
      console.log(newUser);

      const result = await userCollection.insertOne(newUser);
      res.send({
        data: result,
        status: 200,
        message: "user created sucessfully",
      });
    });
    app.post("/signin", async (req, res) => {
      const { email, password } = req.body;
      const user = await userCollection.findOne({ email: email });
      if (!user) {
        return res.status(404).send({ status: 404, message: "User not found" });
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (isPasswordMatched) {
        res.send({
          data: user,
          status: 200,
          message: "user loggedin sucessfully",
        });
      } else {
        res.status(404).send({ status: 404, message: "invalid crediential" });
      }
    });
    //User Authentication collection ends here
    //Product collection Starts here
    app.post("/create-product", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send({
        data: result,
        status: 200,
        message: "Product created sucessfully",
      });
    });
    app.get("/products", async (req, res) => {
      const result = await productCollection.find({}).toArray();
      res.send({
        data: result,
        status: 200,
        message: "All products retrieved sucessfully",
      });
    });
    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;
      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send({
        data: result,
        status: 200,
        message: "successfully Updated the required product",
      });
    });
    app.delete("/products/:id", async (req, res) => {
      const { id } = req.params;
      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send({
        data: result,
        status: 200,
        message: "sucessfully deleted required product",
      });
    });
    app.put("/products/:id", async (req, res) => {
      const { id } = req.params;
      const newProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = {
        $set: {
          title: newProduct.title,
          imageURL: newProduct.imageURL,
          price: newProduct.price,
          rating: newProduct.rating,
          description: newProduct.description,
          featured: newProduct.featured,
          category: newProduct.category,
        },
      };
      const result = await productCollection.updateOne(filter, updatedProduct);
      res.send({
        data: result,
        status: 200,
        message: "successfully updated required product",
      });
    });
    //Product Collection ends here
    //Order Collection starts here
    app.post("/order", async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      res.send({
        data: result,
        status: 200,
        message: "Order created sucessfully",
      });
    });
    app.get("/cartlist", async (req, res) => {
      const { email } = req.body;
      const result = await orderCollection.find({ email: email }).toArray();
      res.send({
        data: result,
        status: 200,
        message: "Order retrieved sucessfully",
      });
    });
    //Order Collection ends here
    //Service Collection starts here
    app.post("/create-service", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send({
        data: result,
        status: 200,
        message: "service created sucessfully",
      });
    });
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.send({
        data: result,
        status: 200,
        message: "All services retrieved sucessfully",
      });
    });
    app.get("/services/:id", async (req, res) => {
      const { id } = req.params;
      const result = await serviceCollection.findOne({ _id: new ObjectId(id) });
      res.send({
        data: result,
        status: 200,
        message: "sucessfully Retrieved the service",
      });
    });
    app.delete("/services/:id", async (req, res) => {
      const { id } = req.params;
      const result = await serviceCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send({
        data: result,
        status: 200,
        message: "sucessfully deleted service",
      });
    });
    app.put("/services/:id", async (req, res) => {
      const { id } = req.params;
      const newService = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedservice = {
        $set: {
          name: newService.name,
          description: newService.description,
          estimatedTime: newService.estimatedTime,
          price: newService.price,
        },
      };
      const result = await productCollection.updateOne(filter, updatedProduct);
      res.send({
        data: result,
        status: 200,
        message: "successfully updated required product",
      });
    });
    //Service Collection ends here

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(
    "Hello World! this is for testing reloading and i installed nodemon"
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
