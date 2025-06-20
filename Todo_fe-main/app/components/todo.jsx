"use client";
import React, { useEffect } from "react";
import { useState } from "react";

export default function Todo({ data }) {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [id, setId] = useState();
  const [origincalTodoState, setOriginalTodoState] = useState(data);

  useEffect(() => {
    setTodos(data);
    setOriginalTodoState(data);
  }, [data]);

  const addTask = async () => {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const item = localStorage.getItem("token");
    let token;

    if (item) {
      token = JSON.parse(item);
      token = token.token;
    }
    console.log("toekn is here", token, base_url, typeof task);

    const response = await fetch(`${base_url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Correct format
        // Use 'Bearer' prefix before the token
      },
      body: JSON.stringify({ task }),
    });
    const res = await response.json();
    console.log("addinga todo", res);
    if (task.trim() !== "") {
      setTodos([...todos, res.todo]);
      setTask("");
    }
  };

  const deleteTask = async (index) => {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const item = localStorage.getItem("token");
    let token;

    if (item) {
      token = JSON.parse(item);
      token = token.token;
    }
    console.log("toekn is here", token);

    const response = await fetch(`${base_url}/?todoId=${index}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Correct format
        // Use 'Bearer' prefix before the token
      },
    });
    const res = await response.json();
    setTodos(todos.filter((item, i) => item._id !== index));
  };

  const editTask = (index) => {
    let taskToEdit = todos[index];
    todos.map((item) => {
      if (item._id == index) {
        setTask(item.todo);
        setId(item._id);
      }
    });

    // let temp = todos[index];

    setIsEditing(true);
    setCurrentTaskIndex(index);
  };
  const handleFilter = (e) => {
    e.preventDefault();
    let search = e.target.value;
    if (search.trim() === "") {
      // If input is empty, show original data
      console.log("here", origincalTodoState);

      setTodos(origincalTodoState);
    } else {
      // Filter based on the search term (case insensitive match)
      const filteredData = todos.filter((todo) =>
        todo.todo.toLowerCase().includes(search.toLowerCase())
      );
      console.log(filteredData);

      setTodos(filteredData);
    }
  };

  const updateTask = async () => {
    console.log(task);

    if (task.trim() !== "") {
      const base_url = process.env.NEXT_PUBLIC_BASE_URL;
      const item = localStorage.getItem("token");
      let token;

      if (item) {
        token = JSON.parse(item);
        token = token.token;
      }
      console.log("toekn is here update", token, base_url, task);

      const response = await fetch(`${base_url}/?todoId=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Correct format
          // Use 'Bearer' prefix before the token
        },
        body: JSON.stringify({ task }),
      });
      const res = await response.json();
      console.log("addinga todo", res);
      todos.map((item) => {
        if (item._id == id) {
          item.todo = res.todo.todo;
        }
      });
      setTask("");
      setIsEditing(false);
      setCurrentTaskIndex(null);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center   p-4">
      <h1 className="text-3xl font-bold    mb-4">To-Do List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          className="p-2 border border-gray-300 text-black rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isEditing ? (
          <button
            onClick={updateTask}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Update Task
          </button>
        ) : (
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        )}
      </div>
      <div className=" flex items-center">
        <p className=" font-bold">Find Todo:</p>
        <input
          type="text"
          className="ml-1 h-6 text-black pl-2 rounded-lg"
          onChange={handleFilter}
        />
      </div>
      <ul className="w-full mt-4 max-w-md">
        {todos &&
          todos.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white p-2 mb-2 border rounded shadow"
            >
              <span className="text-black">{todo.todo}</span>
              <div>
                <button
                  onClick={() => editTask(todo._id)}
                  className="text-yellow-500 hover:text-yellow-700 border-r-2  border-black pr-2 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(todo._id)}
                  className="text-red-500  hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
