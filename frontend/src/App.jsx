import { useEffect, useState } from "react";
import {MdOutlineDone} from "react-icons/md";
import {IoClose} from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
import axios from 'axios';
import { set } from "mongoose";

function App() {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditiedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return; // Fixed: added parentheses
    try {
      const response = await axios.post("/api/todos", {text: newTodo})
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      console.log
      setTodos(response.data)
    } catch (error) {
      console.log("Error finding todos: ", error)
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [])

  const startEditing = (todo) => {
    setEditingTodo(todo._id)
    setEditiedText(todo.text)
  }

  return (
    <div className="min-h-screen 
    bg-gradient-to-br 
    from-gray-50 to-gray-100
    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl
      shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold
          text-gray-800 mb-8">
          Task Manager
        </h1>
        <form onSubmit={addTodo} className="flex items-center gap-2 
        shadow-sm border border-gray-200 p-2 
        rounded-lg">
          <input className="flex-1 outline-none px-3 py-2 
          text-gray-700 placeholder-gray-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value) }
            placeholder="What needs to be done?"
            required
          />
          <button 
          type="submit"
          className="bg-blue-500
          hover:bg-blue-600 text-white px-4
          py-2 rounded-md font-medium cursor-pointer">
            Add task</button>
        </form>
        <div>
          {todos.length == 0 ? (
            <div></div>
          ) : (
            <div>
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editingTodo === todo._id ? (
                    <div>
                      <input 
                      type="text" 
                      value={editedText} 
                      onChange={(e) => setEditiedText(e.target.value)}
                      />
                      <button>
                        <MdOutlineDone />
                        </button>
                      <button onClick={() => setEditiedText(null)}>
                        <IoClose />
                        </button>
                    </div>
                  ) : (
                    <div>
                      {todo.text}
                      <button onClick={() => startEditing(todo)}>
                        <MdModeEditOutline/>
                      </button>
                      <button>
                        <FaTrash/>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div> 
  );
}

export default App;