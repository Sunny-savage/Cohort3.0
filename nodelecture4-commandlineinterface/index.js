const fs = require("fs");
const { Command } = require("commander");
const { log } = require("console");
const program = new Command();

/*
So i have created this Cli on my own, it was easy to be honest, just some things were needed which i used chatgpt for.
*/

program
  .name("counter")
  .description("CLI to do file based tasks")
  .version("0.8.0");

program
  .command("count")
  .description("Count the number of lines in a file")
  .argument("<file>", "file to count")
  .action((file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const lines = data.split(" ").length;
        console.log(`There are ${lines} words in ${file}`);
      }
    });
  });

program
  .command("addTodo")
  .description("Add todo to the file")
  .argument("<String>", "todo to add")
  .action((str) => {
    fs.readFile("todo.json", "utf8", (err, data) => {
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

        const tod = { title: str, id: todos.length + 1, done: false };
        todos.push(tod);

        fs.writeFile(
          "todo.json",
          JSON.stringify(todos, null, 3),
          (writeErr) => {
            if (writeErr) {
              console.log("Error writing file:", writeErr);
            } else {
              console.log("Todo added successfully!");
            }
          }
        );
      }
    });
  });

program
  .command("deleteTodo")
  .description("delete todo to the file")
  .argument("<String>", "todo to delete")
  .action((str) => {
    fs.readFile("todo.json", "utf8", (err, data) => {
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

        const todelete = todos.filter((todo) => todo.title !== str);

        fs.writeFile(
          "todo.json",
          JSON.stringify(todelete, null, 3),
          (writeErr) => {
            if (writeErr) {
              console.log("Error writing file:", writeErr);
            } else {
              console.log("Todo deleted successfully!");
            }
          }
        );
      }
    });
  });

program
  .command("updateTodo")
  .description("update todo to the file")
  .argument("<String>", "todo to updated")
  .argument("<boolean>", "updated value")
  .action((str, donevalue) => {
    fs.readFile("todo.json", "utf8", (err, data) => {
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

        const doneValueBoolean = donevalue === "true";

        const index = todos.findIndex((todo) => todo.title === str);
        todos[index].done = doneValueBoolean;

        console.log(index, str, doneValueBoolean);

        fs.writeFile(
          "todo.json",
          JSON.stringify(todos, null, 3),
          (writeErr) => {
            if (writeErr) {
              console.log("Error writing file:", writeErr);
            } else {
              console.log("Todo updated successfully!");
            }
          }
        );
      }
    });
  });
program.parse();
