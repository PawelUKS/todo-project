import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:8000/api/tasks";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [userId, setUserId] = useState("");

  // UUID aus localStorage holen oder neue generieren
  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);
    fetchTasks(storedUserId);
  }, []);

  // Aufgaben aus dem Backend abrufen
  const fetchTasks = async (user) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const userTasks = data.filter((task) => task.userId === user);
      setTasks(userTasks);
    } catch (error) {
      console.error("Fehler beim Laden der Tasks:", error);
    }
  };

  // Neue Aufgabe hinzufügen
  const addTask = async () => {
    if (!newTask.trim()) return;
    const taskData = {
      userId: userId,
      title: newTask,
      isCompleted: false,
    };
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        setNewTask("");
        fetchTasks(userId);
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Tasks:", error);
    }
  };

  // Aufgabe aktualisieren (z.B. als erledigt markieren)
  const updateTask = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        fetchTasks(userId);
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Tasks:", error);
    }
  };

  // Aufgabe löschen
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchTasks(userId);
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Tasks:", error);
    }
  };

  // Alle Aufgaben löschen
  const deleteAllTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/delete/all`, { method: "DELETE" });
      if (response.ok) {
        setTasks([]);
      }
    } catch (error) {
      console.error("Fehler beim Löschen aller Tasks:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Meine To-Do-App</h1>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Neue Aufgabe..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTask}>
          Hinzufügen
        </button>
      </div>

      {tasks.length > 0 ? (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span style={{ textDecoration: task.isCompleted ? "line-through" : "none" }}>
                {task.title}
              </span>
              <div>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => updateTask(task.id, { ...task, isCompleted: !task.isCompleted })}
                >
                  {task.isCompleted ? "⏪ Rückgängig" : "✔ Erledigt"}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>
                  ❌ Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center mt-3">Noch keine Aufgaben vorhanden.</p>
      )}

      {tasks.length > 0 && (
        <button className="btn btn-danger mt-3 w-100" onClick={deleteAllTasks}>
          Alle löschen
        </button>
      )}
    </div>
  );
};

export default App;
