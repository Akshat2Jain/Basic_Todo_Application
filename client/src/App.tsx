import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";

type Todo = {
  todoid: number;
  title: string;
  description?: string;
  completed?: boolean;
};

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  async function handleTodo(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/postTodo", {
        title: todo,
        description: "Default description for all todos",
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await axios.post("http://localhost:8080/delete", {
        id: id,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleComplete(id: number) {
    try {
      const res = await axios.post("http://localhost:8080/markComplete", {
        id: id,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllTodo() {
    try {
      const res = await axios.get("http://localhost:8080/getTodos");
      setTodos(res.data.todos);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllTodo();
  }, [todo, handleDelete]);

  return (
    <>
      <h1>Todo Application</h1>
      <div>
        <input
          type="text"
          value={todo}
          placeholder="enter todo"
          onChange={(e) => setTodo(e.target.value)}
        />
        <button onClick={handleTodo}>Add Todo</button>
      </div>
      <div>
        {todos.map((td) => (
          <>
            <div
              key={td.todoid}
              style={{
                border: "2px solid black",
                margin: "2em",
                padding: "1em",
              }}
            >
              {" "}
              <p>{td.title}</p>
              <div style={{ marginBottom: "2em" }}>
                {" "}
                {td.completed ? (
                  <>
                    {" "}
                    <s>{td.description}</s>
                  </>
                ) : (
                  <>
                    {" "}
                    <p>{td.description}</p>
                  </>
                )}
              </div>
              <button onClick={() => handleDelete(td.todoid)}>Delete</button>
              {td.completed ? (
                <>{null}</>
              ) : (
                <>
                  <button
                    onClick={() => handleComplete(td.todoid)}
                    style={{ marginLeft: "2em" }}
                  >
                    Mark as completed
                  </button>
                </>
              )}
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default App;
