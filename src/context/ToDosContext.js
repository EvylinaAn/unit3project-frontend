import { useContext, createContext, useState, useCallback } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

export const ToDosContext = createContext();

export function useToDos() {
  return useContext(ToDosContext);
}

export function ToDosProvider({ children }) {
  const { user } = useUser();
  const [groupedTodos, setGroupedTodos] = useState({});
  
  const [todos, setTodos] = useState([
    {
      todo: "",
      completed: false,
    },
  ]);

  const [newToDo, setNewToDo] = useState({
    todo: "",
    completed: false,
    date: new Date().toISOString().substr(0, 10),
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todos`,
        {
          headers: {
            "user-email": user.email,
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      setTodos(result);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  function handleChange(evt) {
    setNewToDo({
      ...newToDo,
      [evt.target.name]: evt.target.value,
    });
  }

  async function handleAddToDo(e) {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/todos/add`,
        newToDo,
        {
          headers: {
            "user-email": user.email,
            "Content-Type": "application/json",
          },
        }
      );
      setNewToDo({
        todo: "",
        completed: false,
        date: new Date().toISOString().substr(0, 10), // Reset date to today
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  function handleCheckboxChange(id) {
    const updatedTodos = [...todos]
    const todo = updatedTodos.find(t => t._id === id)
    todo.completed = !todo.completed
    setTodos(updatedTodos)
    updateTodoOnServer(todo)
    console.log(todo)
  }

  function handleInputChange(id, newValue) {
    const updatedTodos = [...todos]
    const todo = updatedTodos.find(t => t._id === id)
    todo.todo = newValue
    setTodos(updatedTodos)
    updateTodoOnServer(todo)
    console.log(todo)
  }

  async function updateTodoOnServer(updatedTodo) {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/todos/${updatedTodo._id}`,
        updatedTodo,
        {
          Headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteTodo(todoId, index) {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/todos/${todoId}`
      );
      deleteCompletedTodo(index);
      await fetchData()
    } catch (e) {
      console.error(e);
    }
  }

  function deleteCompletedTodo(index) {
    const updatedTodos = todos.filter((todo, idx) => index !== idx);
    setTodos(updatedTodos);
  }

  function completedTodo(index) {
    const updatedTodos = [...todos];
    updatedTodos[index] = {
      ...updatedTodos[index],
      completed: !updatedTodos[index].completed,
    };
    setTodos(updatedTodos);
  }

  const groupTodosByYear = (todos) => {
    const grouped = todos.reduce((acc, todo) => {
      const date = new Date(todo.date);
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "long" });
      const day = date.getDate();

      acc[year] = acc[year] || {};
      acc[year][month] = acc[year][month] || {};
      acc[year][month][day] = acc[year][month][day] || [];
      acc[year][month][day].push(todo);

      return acc;
    }, {});
    return grouped;
  };

  const sortMonthsAndDays = (years) => {
    for (const year in years) {
      years[year] = Object.fromEntries(
        Object.entries(years[year]).sort((a, b) => {
          const monthOrder = {
            January: 0,
            February: 1,
            March: 2,
            April: 3,
            May: 4,
            June: 5,
            July: 6,
            August: 7,
            September: 8,
            October: 9,
            November: 10,
            December: 11,
          };
          return monthOrder[a[0]] - monthOrder[b[0]];
        })
      );
      for (const month in years[year]) {
        years[year][month] = Object.fromEntries(
          Object.entries(years[year][month]).sort(
            (a, b) => parseInt(a[0]) - parseInt(b[0])
          )
        );
      }
    }
    return years;
  };

  return (
    <ToDosContext.Provider
      value={{
        todos,
        setTodos,
        fetchData,
        deleteCompletedTodo,
        handleChange,
        handleAddToDo,
        newToDo,
        setNewToDo,
        handleCheckboxChange,
        handleInputChange,
        updateTodoOnServer,
        deleteTodo,
        completedTodo,
        groupedTodos,
        setGroupedTodos,
        groupTodosByYear,
        sortMonthsAndDays,
      }}
    >
      {children}
    </ToDosContext.Provider>
  );
}
