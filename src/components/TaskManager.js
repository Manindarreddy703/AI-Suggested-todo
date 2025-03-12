import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [suggestion, setSuggestion] = useState("");

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        setTasks(storedTasks);
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    // Add new task
    const addTask = () => {
        if (task.trim() === "") {
            alert("Task cannot be empty!");
            return;
        }
        const newTask = { id: Date.now(), task };
        setTasks([...tasks, newTask]);
        setTask(""); // Clear input field
    };

    // Fetch AI-generated task suggestion
    const getSuggestion = async () => {
        const API_KEY = process.env.REACT_APP_OPENAI_API_KEY?.trim(); // Ensure no extra spaces

        if (!API_KEY) {
            console.error("❌ Missing OpenAI API key.");
            return;
        }

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/completions",
                {
                    model: "gpt-3.5-turbo",
                    prompt: `Suggest a productive task related to: "${task}"`,
                    max_tokens: 50
                },
                {
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setSuggestion(response.data.choices[0]?.text.trim() || "No suggestion available.");
        } catch (error) {
            console.error("❌ Error fetching suggestion:", error.response?.data || error.message);
            setSuggestion("Error fetching suggestion. Try again.");
        }
    };

    // Delete a task
    const deleteTask = (id) => {
        const updatedTasks = tasks.filter((t) => t.id !== id);
        setTasks(updatedTasks);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h2>📝 Task Manager</h2>
            <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a task..."
                style={{ padding: "8px", width: "80%", marginBottom: "10px" }}
            />
            <div>
                <button onClick={addTask} style={{ marginRight: "5px" }}>➕ Add Task</button>
                <button onClick={getSuggestion}>✨ AI Suggest Task</button>
            </div>
            <p><strong>Suggestion:</strong> {suggestion}</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {tasks.map((t) => (
                    <li key={t.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        {t.task}
                        <button onClick={() => deleteTask(t.id)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
