const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://todo_owner:cehFOA80NPDi@ep-twilight-snow-a589c8f0.us-east-2.aws.neon.tech/todo?sslmode=require",
});

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.status(200).json({ msg: "Ok" });
});

app.post("/postTodo", async function (req, res) {
  const client = await pool.connect();
  try {
    const insertTodo = "insert into todo (title,description) values ($1,$2);";
    const values = [`${req.body.title}`, `${req.body.description}`];
    const response = await client.query(insertTodo, values);
    res.status(200).json({ msg: "Todo created succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something Went Wrong" });
  } finally {
    client.release();
  }
});

app.post("/delete", async function (req, res) {
  const client = await pool.connect();
  try {
    const deleteQuery = "delete from todo where todoid= $1;";
    const values = [`${req.body.id}`];
    const response = await client.query(deleteQuery, values);
    res.status(200).json({ msg: "Deleted succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something Went Wrong" });
  } finally {
    client.release();
  }
});

app.post("/markComplete", async function (req, res) {
  const client = await pool.connect();
  try {
    const completeQuery = "update todo set completed=true where todoId = $1";
    const values = [`${req.body.id}`];
    const response = await client.query(completeQuery, values);
    res.status(200).json({ msg: "Todo Completed" });
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
});

app.get("/getTodos", async function (req, res) {
  const client = await pool.connect();
  try {
    const getTodo = "select * from todo;";
    const response = await client.query(getTodo);
    const todos = response.rows;
    res.status(200).json({ todos });
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
});

app.put("/update", async function (req, res) {
  const client = await pool.connect();
  try {
    const updateQuery = "update todo set title= $1 where todoId= $2;";
    const values = [`${req.body.title}`, `${req.body.todoId}`];
    const response = await client.query(updateQuery, values);
    console.log(response);
    res.status(200).json({ msg: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something Went Wrong" });
  } finally {
    client.release();
  }
});

app.listen(port, function (res, res) {
  console.log(`Server is running on port ${port}`);
});
