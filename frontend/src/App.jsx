import { useEffect, useState } from "react";
import {MdOutlineDone} from "react-icons/md";
import {IoClose} from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
import axios from 'axios';

function App() {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState(""); // Fixed typo: was setEditiedText

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
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
      setTodos(response.data)
    } catch (error) {
      console.log("Error finding todos: ", error)
    }
  }

  const updateTodo = async (id, updatedData) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, updatedData);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedText.trim()) return;
    await updateTodo(editingTodo, { text: editedText });
    setEditingTodo(null);
    setEditedText("");
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditedText("");
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const toggleComplete = async (todo) => {
    await updateTodo(todo._id, { completed: !todo.completed });
  };

  useEffect(() => {
    fetchTodos();
  }, [])

  return (
    <div className="min-h-screen 
    bg-gradient-to-br 
    from-gray-50 to-gray-100
    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl
      shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold
          text-gray-800 mb-8 text-center">
          <IoClipboardOutline className="inline-block mr-2" />
          Task Manager
        </h1>
        
        <form onSubmit={addTodo} className="flex items-center gap-2 
        shadow-sm border border-gray-200 p-2 
        rounded-lg mb-6">
          <input className="flex-1 outline-none px-3 py-2 
          text-gray-700 placeholder-gray-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
          <button 
          type="submit"
          className="bg-blue-500
          hover:bg-blue-600 text-white px-4
          py-2 rounded-md font-medium cursor-pointer
          transition-colors duration-200">
            Add task
          </button>
        </form>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <IoClipboardOutline className="mx-auto text-4xl mb-2" />
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className="flex items-center gap-3 p-3 
              border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                {editingTodo === todo._id ? (
                  <>
                    <input 
                      type="text" 
                      value={editedText} 
                      onChange={(e) => setEditedText(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 
                      rounded focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-800 
                      p-1 rounded transition-colors"
                      title="Save"
                    >
                      <MdOutlineDone size={20} />
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-800 
                      p-1 rounded transition-colors"
                      title="Cancel"
                    >
                      <IoClose size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleComplete(todo)}
                      className={`w-5 h-5 rounded border-2 flex items-center 
                      justify-center transition-colors ${
                        todo.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                      title={todo.completed ? "Mark incomplete" : "Mark complete"}
                    >
                      {todo.completed && <MdOutlineDone size={14} />}
                    </button>
                    
                    <span className={`flex-1 ${
                      todo.completed 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-800'
                    }`}>
                      {todo.text}
                    </span>
                    
                    <button 
                      onClick={() => startEditing(todo)}
                      className="text-blue-600 hover:text-blue-800 
                      p-1 rounded transition-colors"
                      title="Edit"
                    >
                      <MdModeEditOutline size={18} />
                    </button>
                    
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="text-red-600 hover:text-red-800 
                      p-1 rounded transition-colors"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div> 
  );
}

export default App;