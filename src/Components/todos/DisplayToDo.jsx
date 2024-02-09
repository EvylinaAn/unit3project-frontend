import {InputGroup, Form, Button} from "react-bootstrap";
import { useToDos } from "../../context/ToDosContext";
import { useEffect } from "react";

export default function DisplayToDo({  setTodos, deleteCompletedTodo }) {
  const {handleCheckboxChange, handleInputChange, deleteTodo, todos, fetchData} = useToDos()
    //   console.log(todos);
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const todosFromToday = todos.filter(todo => {
            const createdAtDate = new Date(todo.date);
            const createdAtDateOnly = new Date(createdAtDate.getFullYear(), createdAtDate.getMonth(), createdAtDate.getDate());
            return createdAtDateOnly.getTime() === todayDate.getTime();
    });


    useEffect(() => {
      fetchData()
      // eslint-disable-next-line
    }, [])

  return (
    <div>
      
      {
      todosFromToday.length === 0 
      ?
      (<p>No todos created today.</p>)
      :
      (todosFromToday.map((todo, index) => (
        <InputGroup className="mb-3" key={index}>
          <InputGroup.Checkbox
            aria-label="Checkbox for following text input"
            checked={todo.completed}
            onChange={() => handleCheckboxChange(todo._id)}
          />
          <Form.Control
            aria-label="Text input with checkbox"
            value={todo.todo}
            onChange={(e) => handleInputChange(todo._id, e.target.value)}
          />
          <Button 
            variant="outline-success" 
            size="sm" 
            onClick={() => deleteTodo(todo._id, index)}
          >
            x
          </Button>
        </InputGroup>
      )))}
    </div>
  );
}
