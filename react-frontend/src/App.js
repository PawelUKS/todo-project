import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:8000/api/tasks";
const UUID_URL = "http://localhost:8000/api/tasks/generate-uuid"; // Korrigierte API-Route

function App() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [editTaskId, setEditTaskId] = useState(null);
    const [userUUID, setUserUUID] = useState("");

    // UUID aus Backend holen, falls nicht vorhanden
    const getUserUUID = async () => {
        let uuid = localStorage.getItem("userUUID");
        if (!uuid) {
            const response = await fetch(UUID_URL);
            const data = await response.json();
            uuid = data.uuid;
            localStorage.setItem("userUUID", uuid);
        }
        return uuid;
    };

    useEffect(() => {
        getUserUUID().then(uuid => {
            setUserUUID(uuid);
            fetch(`${API_URL}?userUuid=${uuid}`)
                .then((res) => res.json())
                .then((data) => setTasks(data))
                .catch((err) => console.error("Fehler beim Laden:", err));
        });
    }, []);

    // Task hinzufügen oder bearbeiten
    const handleTaskSubmit = () => {
        if (!inputValue.trim()) return;

        if (editTaskId) {
            // Bearbeiten (PUT)
            fetch(`${API_URL}/${editTaskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: inputValue })
            })
                .then(() => {
                    setTasks(tasks.map(task =>
                        task.id === editTaskId ? { ...task, title: inputValue } : task
                    ));
                    setEditTaskId(null);
                    setInputValue("");
                });
        } else {
            // Hinzufügen (POST)
            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userUUID, title: inputValue })
            })
                .then((res) => res.json())
                .then((newTask) => {
                    setTasks([...tasks, newTask]);
                    setInputValue("");
                });
        }
    };

    // Task als erledigt markieren
    const toggleTaskCompletion = (id, isCompleted) => {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isCompleted: !isCompleted })
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.map(task =>
                    task.id === id ? { ...task, isCompleted: !isCompleted } : task
                ));
            });
    };

    // Task bearbeiten (Text ins Eingabefeld setzen)
    const handleEditTask = (task) => {
        setEditTaskId(task.id);
        setInputValue(task.title);
    };

    // Task löschen
    const handleDeleteTask = (id) => {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => {
                setTasks(tasks.filter(task => task.id !== id));
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Meine To-Do-App</h2>
            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Neuer Task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleTaskSubmit}>
                    {editTaskId ? "Speichern" : "Hinzufügen"}
                </button>
            </div>
            <ul className="list-group">
                {tasks.map((task) => (
                    <li key={task.id} className={`list-group-item d-flex justify-content-between align-items-center ${task.isCompleted ? "bg-success text-white" : ""}`}>
                        <div>
                            {/* Checkbox für Erledigt */}
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={task.isCompleted}
                                onChange={() => toggleTaskCompletion(task.id, task.isCompleted)}
                            />
                            {task.title}
                        </div>
                        <div>
                            {/* Bearbeiten-Button (nur wenn Task nicht erledigt ist) */}
                            {!task.isCompleted && (
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditTask(task)}>Bearbeiten</button>
                            )}
                            {/* Löschen-Button immer sichtbar */}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task.id)}>Löschen</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
