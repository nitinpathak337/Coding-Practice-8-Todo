const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

let dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDB();

//Get Todos based on filter API

app.get("/todos/", async (request, response) => {
  const { status = "", priority = "", search_q = "" } = request.query;
  console.log(status);
  console.log(priority);
  console.log(search_q);
  const getTodosQuery = `
    select * 
    from todo
    where status like '%${status}%'
    and priority like '%${priority}%'
    and todo like '%${search_q}%';`;
  const getTodos = await db.all(getTodosQuery);
  response.send(getTodos);
});

//Get todo based on id API

app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    select * 
    from todo
    where id=${todoId}`;
  const getTodo = await db.get(getTodoQuery);
  response.send(getTodo);
});

//Create Todo API

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const addTodoQuery = `
    Insert into
    todo values
    (${id},'${todo}','${priority}','${status}');`;
  const addTodo = await db.run(addTodoQuery);
  response.send("Todo Successfully Added");
});

//Update Todo API

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo = "", priority = "", status = "" } = request.body;
  if (todo !== "") {
    const updateTodoQuery = `
        update todo
        set todo='${todo}'
        where id=${todoId};`;
    const updateTodo = await db.run(updateTodoQuery);
    response.send("Todo Updated");
  } else if (priority !== "") {
    const updateTodoQuery = `
        update todo
        set priority='${priority}'
        where id=${todoId};`;
    const updateTodo = await db.run(updateTodoQuery);
    response.send("Priority Updated");
  } else if (status !== "") {
    const updateTodoQuery = `
        update todo
        set status='${status}'
        where id=${todoId};`;
    const updateTodo = await db.run(updateTodoQuery);
    response.send("Status Updated");
  }
});

//Delete Todo API

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
    delete from
    todo where
    id=${todoId};`;
  const deleteTodo = await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
