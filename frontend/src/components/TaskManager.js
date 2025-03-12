import React, { useState, useEffect } from "react";
import axios from "axios";
const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [suggestion, setSuggestion] = useState("");
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        setTasks(storedTasks);
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);


    const addTask = () => {
        if (task.trim() === "") {
            alert("Task cannot be empty!");
            return;
        }
        const newTask = { id: Date.now(), task };
        setTasks([...tasks, newTask]);
        setTask("");
    };

    const getSuggestion = async () => {
        const API_KEY = "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"; // Secured key
        if (!API_KEY) {
            console.error("Missing OpenAI API key.");
            return;
        }
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/completions",
                {
                    model: "gpt-3.5-turbo",
                    prompt: `Suggest a task based on: ${task}`,
                    max_tokens: 50
                },
                {
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setSuggestion(response.data.choices[0].text.trim());
        } catch (error) {
            console.error("Error fetching suggestion:", error);
        }
    };


    const deleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
    };

    return (
        <div>
            <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a task"
            />
            <button onClick={addTask}>Add Task</button>
            <button onClick={getSuggestion}>AI Suggest Task</button>
            <p>Suggestion: {suggestion}</p>
            <ul>
                {tasks.map((t) => (
                    <li key={t.id}>
                        {t.task}
                        <button onClick={() => deleteTask(t.id)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
