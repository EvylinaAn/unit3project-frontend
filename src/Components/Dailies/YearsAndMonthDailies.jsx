import { Container, Accordion } from "react-bootstrap";
import { useDailies } from "../../context/DailiesContext";
import { useEffect } from "react";
import AllDailiesInDays from "./AllDailiesInDays";

export default function YearsAndMonthDailies() {
  const { fetchQuicksData, quicks } = useDailies();

  const sortedDailies = quicks.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const groupedDailies = sortedDailies.reduce((acc, quick) => {
    const createdAtDate = new Date(quick.createdAt);
    const year = createdAtDate.getFullYear();
    // const month = createdAtDate.getMonth();
    const monthName = createdAtDate.toLocaleString("default", {
      month: "long",
    });

    if (!acc[year]) {
      acc[year] = {};
    }

    if (!acc[year][monthName]) {
      acc[year][monthName] = {};
    }

    const date = createdAtDate.getDate();

    if (!acc[year][monthName][date]) {
      acc[year][monthName][date] = [];
    }

    acc[year][monthName][date].push(quick);
    return acc;
  }, {});

  useEffect(() => {
    fetchQuicksData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="d-flex flex-column align-items-center" style={{ width: "100%" }}>
      <h1 className="p-3 mt-3" style={{ color: "#3a7e54", fontSize: 40}}>All Daily Checks</h1>
      <Container className="d-flex flex-column">
        <div className="mt-5" style={{ width: "100%" }}>
          {Object.entries(groupedDailies).map(([year, months]) => (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h4>
                <strong>{year}</strong>
              </h4>{" "}
              <Accordion style={{ width: "100%" }}>
                {Object.entries(months).map(([month, dates]) => (
                  <Accordion.Item key={month} eventKey={year + "-" + month}>
                    <Accordion.Header>{month}</Accordion.Header>
                    <Accordion.Body>
                      <AllDailiesInDays
                        month={month}
                        year={year}
                        dates={dates}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
