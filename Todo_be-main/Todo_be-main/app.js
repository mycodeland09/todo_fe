const express = require("express"); // Import Express
const connectUsingMongoose = require("./config/mongoose");
const authenticateToken = require("./middlewares/auth.js");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var cors = require("cors");
const mongoose = require("mongoose");
const app = express(); // Create an Express application
const PORT = 3000; // Define the port
app.use(express.json());
app.use(cors());

//Creating schema
const todoSchema = new mongoose.Schema({
  todo: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the User model
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
});

//Creating Models
const UserModel = mongoose.model("user", userSchema);
const TodoModel = mongoose.model("todo", todoSchema);

//Endpoints

//To get all the todo
app.get("/", authenticateToken, async (req, res) => {
  const userId = req.userID;
  console.log("id in get", userId);

  const todos = await TodoModel.find({ user_id: userId });

  console.log("allthetodos", todos);
  res.json(todos);
});

//To create a new account
app.post("/signup", async (req, res) => {
  const { name, email, password, type } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);

  const user = { name: name, email: email, password: hashPassword };

  try {
    const newUser = new UserModel(user);
    await newUser.save();
  } catch (err) {
    console.log(err);
  }

  res.status(201).send(user);
});

//To login in into exsisting account
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  console.log("fetailsishere", user);

  try {
    if (!user) {
      return res.status(400).send("incorrect credentials");
    } else {
      const match = bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          { userID: user._id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        return res.json({ token: token });
      }
    }
  } catch (err) {
    console.log(err);
  }

  res.status(201).send(user);
});

//Creating a todo
// app.post("/todo", async (req, res) => {
//   const { todo } = req.body;

//   const userId = req.userID;
//   const addedTodo = new TodoModel({ todo, user_id: userId });
//   await addedTodo.save();
//   res.send("Added Todo Successfully");
// });

//Updating a exsisting todo
app.put("/", authenticateToken, async (req, res) => {
  const { todoId } = req.query;
  console.log("todoId", todoId);

  const updateData = req.body;
  console.log("updateData", req.body.task, updateData);

  const userId = req.userID;
  console.log("adding a new todo", userId, todoId);

  try {
    // Attempt to find the todo by ID and user_id. If not found, create a new one.
    if (!todoId) {
      console.log("here");
      // If todoId is not provided, it's a new todo, so create it with the userId
      const newTodo = new TodoModel({
        todo: updateData.task,
        user_id: userId, // Ensure user_id is set
      });

      await newTodo.save(); // Save the new todo to the database
      return res.status(201).json({
        message: "Todo created successfully",
        todo: newTodo,
      });
    } else {
      console.log("!!!!!!!!!hereisthe");

      const updatedTodo = await TodoModel.findOneAndUpdate(
        { _id: todoId, user_id: userId }, // Find by todoId and userId
        { todo: updateData.task }, // Update data to apply
        {
          new: true, // Return the updated document
          upsert: true, // If not found, create a new todo document
        }
      );
      if (updatedTodo) {
        console.log("Todo updated or created:", updatedTodo);
        res.status(200).json({
          message: "Todo updated or created successfully",
          todo: updatedTodo,
        });
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    }
  } catch (err) {
    console.error("Error updating or creating todo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Deleting a exsisting todo
app.delete("/", async (req, res) => {
  const { todoId } = req.query;
  console.log("todoId", todoId);

  const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
  if (deletedTodo) {
    res
      .status(200)
      .json({ message: "Todo deleted successfully", todo: deletedTodo });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectUsingMongoose();
});
