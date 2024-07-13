import { Container, Accordion } from "react-bootstrap";
import { useEffect } from "react";
import { useToDos } from "../../context/ToDosContext";
import AllTodosInDays from "./AllTodosInDays";
import { Link } from "react-router-dom";

export default function YearsAndMonthToDos() {
  const {
    groupedTodos,
    setGroupedTodos,
    groupTodosByYear,
    sortMonthsAndDays,
    todos,
    fetchData,
  } = useToDos();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const groupedByYear = groupTodosByYear(todos);
    const sortedYears = sortMonthsAndDays(groupedByYear);
    setGroupedTodos(sortedYears);
    // eslint-disable-next-line
  }, [todos]);

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ width: "100%" }}
    >
      <h1 className="p-3 mt-3" style={{ color: "#3a7e54", fontSize: 40 }}>
        All To-Do's
      </h1>
      <Container className="d-flex flex-column">
        {Object.entries(groupedTodos).length === 0 ? (
          <div className="mt-5">
            <p>
              You have nothing to Display, start creating your todo's by going{" "}
              <Link to="/" style={{ textDecoration: "none" }}>
                home
              </Link>{" "}
              and adding To-Do.{" "}
            </p>
          </div>
        ) : (
          Object.entries(groupedTodos).map(([year, months]) => (
            <div className="mt-5" alwaysOpen>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <h4>
                  <strong>{year}</strong>
                </h4>
                <Accordion style={{ width: "100%" }}>
                  {Object.entries(months).map(([month, days]) => (
                    <Accordion.Item key={month} eventKey={year + "-" + month}>
                      <div>
                        <Accordion.Header>{month}</Accordion.Header>
                        <Accordion.Body>
                          <AllTodosInDays
                            month={month}
                            year={year}
                            days={days}
                          />
                        </Accordion.Body>
                      </div>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </div>
          ))
        )}
      </Container>
    </div>
  );
}
