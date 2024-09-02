const express = require("express");
const fs = require("fs");
const app = express();
const { v4: uuidv4 } = require("uuid");

app.use(express.json());

app.post("/createTodo", function (req, res) {
  fs.readFile("todos.json", "utf-8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let todos = [];
      try {
        todos = JSON.parse(data); // Convert JSON string to JavaScript object
      } catch (parseErr) {
        console.log("Error parsing JSON data:", parseErr);
        return;
      }

      const todo = req.body.todo;
      const userId = req.query.userId;
      let addeddata;
      const userexist = todos.findIndex((user) => user.userId === userId);

      if (userexist === -1) {
        addeddata = {
          userId: userId,
          todo: [{ todoname: todo, todoId: uuidv4() }],
        };
        todos.push(addeddata);
      } else {
        addeddata = { todoname: todo, todoId: uuidv4() };
        todos[userexist].todo.push(addeddata);
      }

      console.log(userexist, addeddata);

      fs.writeFile("todos.json", JSON.stringify(todos, null, 2), (writeErr) => {
        if (writeErr) {
          console.log("Error writing file:", writeErr);
        } else {
          console.log("Todo added successfully!");
          res.status(200).send({ msg: "successfully added", data: todos });
        }
      });
    }
  });
});

app.get("/getTodos", function (req, res) {
  fs.readFile("todos.json", "utf-8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let todos = [];
      try {
        todos = JSON.parse(data); // Convert JSON string to JavaScript object
      } catch (parseErr) {
        console.log("Error parsing JSON data:", parseErr);
        return;
      }
      const userId = req.query.userId;
      const userexist = todos.findIndex((user) => user.userId === userId);

      if (userexist === -1) {
        res.status(404).send({ msg: "user does not exist" });
      } else {
        res.status(200).send({
          data:
            todos[userexist].todo.length > 0
              ? todos[userexist]
              : "no todos available",
        });
      }
    }
  });
});

app.delete("/deleteTodo", function (req, res) {
  const todoid = req.query.todoId;
  const userId = req.query.userId;
  fs.readFile("todos.json", "utf-8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let todos = [];
      try {
        todos = JSON.parse(data); // Convert JSON string to JavaScript object
      } catch (parseErr) {
        console.log("Error parsing JSON data:", parseErr);
        return;
      }

      const userexist = todos.findIndex((user) => user.userId === userId);
      console.log(userexist, todoid, userId);

      if (userexist === -1) {
        res.status(404).send({ msg: "user does not exist" });
      } else {
        let currenttodo = todos[userexist].todo;
        let updatedtodo = currenttodo.filter((todo) => todo.todoId !== todoid);
        // const updateddata = todos[userexist].todo.filter(
        //   (todoId) => todoId !== todoid
        // );
        console.log(updatedtodo);

        todos[userexist].todo = updatedtodo;
        fs.writeFile(
          "todos.json",
          JSON.stringify(todos, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.log("Error writing file:", writeErr);
            } else {
              console.log("Todo deleted successfully!");
              res
                .status(200)
                .send({ msg: "successfully deleted", data: todos });
            }
          }
        );
      }
    }
  });
});

app.put("/updateTodo", function (req, res) {
  fs.readFile("todos.json", "utf-8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let todos = [];
      try {
        todos = JSON.parse(data); // Convert JSON string to JavaScript object
      } catch (parseErr) {
        console.log("Error parsing JSON data:", parseErr);
        return;
      }

      const todo = req.body.todo;
      const userId = req.query.userId;
      const todoId = req.query.todoId;

      const userexist = todos.findIndex((user) => user.userId === userId);

      if (userexist === -1) {
        res.status(404).send({ msg: "user does not exist" });
      } else {
        const todoexist = todos[userexist].todo.findIndex(
          (tod) => tod.todoId === todoId
        );

        if (todoexist === -1) {
          res.status(404).send({ msg: "todo does not exist" });
        } else {
          todos[userexist].todo[todoexist].todoname = todo;
          fs.writeFile(
            "todos.json",
            JSON.stringify(todos, null, 2),
            (writeErr) => {
              if (writeErr) {
                console.log("Error writing file:", writeErr);
              } else {
                console.log("Todo updated successfully!");
                res
                  .status(200)
                  .send({ msg: "successfully updated", data: todos });
              }
            }
          );
        }
      }
    }
  });
});

app.listen(3000);
