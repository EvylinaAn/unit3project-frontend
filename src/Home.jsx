import { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import Quicks from "./Components/Dailies/Quicks";
import ToDoList from "./Components/todos/ToDoList";
import Schedule from "./Components/schedule/NewScheduleModal";
import DisplayToDo from "./Components/todos/DisplayToDo";
import DisplayDaily from "./Components/Dailies/DisplayDaily";
import DisplaySchedule from "./Components/schedule/DisplaySchedule";
import "./App.css";
import { useToDos } from "./context/ToDosContext";

export default function Home({
  user,
  setUser,
  getUser,
  quicks,
  setQuicks,
  fetchQuicksData,
  selectedDaily,
  setSelectedDaily,
}) {
  const [quicksModal, setQuicksModal] = useState(false);
  const [todoModal, setTodoModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editSchedule, setEditSchedule] = useState(false);

  const { deleteCompletedTodo, todos, setTodos, fetchData } = useToDos();

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const todayTtile = new Date().toLocaleDateString('en-GB', options);



  function handleShowModal(modalType) {
    modalType(true);
  }

  function handleCloseModal(modalType) {
    modalType(false);
  }

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      fetchQuicksData();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function getQuote() {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const objectsFromToday = quicks.filter((quick) => {
      const createdAtDate = new Date(quick.createdAt);
      const createdAtDateOnly = new Date(
        createdAtDate.getFullYear(),
        createdAtDate.getMonth(),
        createdAtDate.getDate()
      );
      return createdAtDateOnly.getTime() === todayDate.getTime();
    });

    if (objectsFromToday.length > 0) {
      objectsFromToday.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return objectsFromToday[0].quote;
    } else {
      return "You haven't added your quote of the day!";
    }
  }

  return (
    <div className="d-flex flex-grow-1">
      <Container className="d-flex flex-column justify-content-evenly">
        <Container className="QUOTE d-flex flex-column align-items-center">
          <p style={{ color: "#3a7e54"}}>Your Quote of the Day</p>
          <h1 className="fst-italic text-center">"{getQuote()}"</h1>
        </Container>
        <Container className="BUTTONS d-flex justify-content-center">
          <Button variant="success" className="m-3" onClick={() => handleShowModal(setQuicksModal)}>
            Add Daily Check
          </Button>
          <Button
            variant="success"
            className="m-3"
            onClick={() => handleShowModal(setScheduleModal)}
          >
            Add Schedule
          </Button>
          <Button
            variant="success"
            className="m-3"
            onClick={() => {
              fetchData();
              handleShowModal(setTodoModal);
            }}
          >
            Add To-Do
          </Button>
        </Container>

        <hr className="m-0 p-0" />

        <Container className="TODAYS d-flex justify-content-center m-0">
          <h5><strong>{`${todayTtile}`}</strong></h5>
        </Container>

        <Container className="d-flex flex-row justify-content-center">
          <Container className="d-flex flex-column align-items-center">
            <p style={{ color: "#3a7e54"}}>Today's To-do's</p>
            <DisplayToDo
              todos={todos}
              setTodos={setTodos}
              fetchData={fetchData}
              deleteCompletedTodo={deleteCompletedTodo}
            />
          </Container>
          <Container className="d-flex flex-column align-items-center">
            <p style={{ color: "#3a7e54"}}>Today's Schedule</p>
            <DisplaySchedule
              showModal={editSchedule}
              handleClose={() => handleCloseModal(setEditSchedule)}
              editSchedule={editSchedule}
              setEditSchedule={setEditSchedule}
              handleShowModal={() => handleShowModal(setEditSchedule)}
            />
          </Container>
        </Container>
        <Container className="QUICK d-flex flex-column align-items-center">
          <p style={{ color: "#3a7e54"}}>Today's Daily Check</p>
          <DisplayDaily
            fetchQuicksData={fetchQuicksData}
            quicks={quicks}
            setQuicks={setQuicks}
            quicksModal={quicksModal}
            setQuicksModal={setQuicksModal}
            selectedDaily={selectedDaily}
            setSelectedDaily={setSelectedDaily}
            showModal={editModal}
            handleClose={() => handleCloseModal(setEditModal)}
            editModal={editModal}
            setEditModal={setEditModal}
            handleShowModal={() => handleShowModal(setEditModal)}
          />
        </Container>
      </Container>
      <Quicks
        showModal={quicksModal}
        handleClose={() => handleCloseModal(setQuicksModal)}
        user={user}
        fetchQuicksData={fetchQuicksData}
        selectedDaily={selectedDaily}
        setSelectedDaily={selectedDaily}
      />
      <ToDoList
        showModal={todoModal}
        handleClose={() => handleCloseModal(setTodoModal)}
        user={user}
        todos={todos}
        setTodos={setTodos}
        fetchData={fetchData}
        deleteCompletedTodo={deleteCompletedTodo}
      />
      <Schedule showModal={scheduleModal} handleClose={() => handleCloseModal(setScheduleModal)} />
    </div>
  );
}
