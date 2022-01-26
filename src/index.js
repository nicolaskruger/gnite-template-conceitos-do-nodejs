const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const res = require("express/lib/response");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return response.status(400).json({
      msg: "user not found",
    });
  }

  request.user = user;

  next();
}

app.post("/users", (request, response) => {
  // Complete aqui

  const { name, username } = request.body;

  if (users.some((u) => u.username === username)) {
    return response.status(400).json({
      msg: "allready existis",
      error: true,
    });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { title, deadline } = request.body;

  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { id } = request.params;

  const { title, deadline } = request.body;

  let retTodo = {};

  if (!user.todos.some((todo) => todo.id === id)) {
    return response.status(404).json({
      error: true,
    });
  }
  user.todos = user.todos.map((todo) => {
    if (todo.id === id) {
      retTodo = {
        ...todo,
        title,
        deadline,
      };
      return retTodo;
    }
    return todo;
  });
  return response.status(201).json(retTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  let retTodo = {};

  if (!user.todos.some((todo) => todo.id === id)) {
    return response.status(404).json({
      error: true,
    });
  }

  user.todos = user.todos.map((todo) => {
    if (todo.id === id) {
      retTodo = {
        ...todo,
        done: true,
      };
      return retTodo;
    }
    return todo;
  });
  return response.json(retTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  if (!user.todos.some((todo) => todo.id === id)) {
    return response.status(404).json({
      error: true,
    });
  }

  user.todos.splice(
    user.todos.findIndex((todo) => todo.id === id),
    1
  );
  return response.status(204).json();
});

module.exports = app;
