import React, { useState, useEffect } from "react";
import "./App.css";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch all todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://hono-postgresql.onrender.com/todos"
      );
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos: ", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const response = await fetch(
          "https://hono-postgresql.onrender.com/todos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newTodo }),
          }
        );
        const data = await response.json();
        setTodos((prevTodos) => [...prevTodos, data]);
        setNewTodo("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
