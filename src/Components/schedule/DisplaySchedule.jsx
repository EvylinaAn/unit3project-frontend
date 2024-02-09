import { Container, InputGroup, Form, Button } from "react-bootstrap";
import { useSchedule } from "../../context/ScheduleContext";
import { useEffect, useState } from "react";
import EditSchedule from "./EditSchedule"
// import { CiEdit } from "react-icons/ci";

export default function DisplaySchedule({
    handleClose,
    editSchedule,
    setEditSchedule,
    handleShowModal,
}) {
    const { schedule, getSchedule, deleteSchedule } = useSchedule();

    const [selectedScheduleId, setSelectedScheduleId] = useState(null)

    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     const day = date.getDate().toString().padStart(2, "0");
    //     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    //     const year = date.getFullYear().toString().substr(-2); // Get last two digits of the year
    //     return `${day}/${month}/${year}`;
    // };

    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Filter elements with today's date
    const scheduleToday = schedule.filter((element) => {
        const elementDate = new Date(element.date);
        return (
            elementDate.getDate() === todayDate.getDate() &&
            elementDate.getMonth() === todayDate.getMonth() &&
            elementDate.getFullYear() === todayDate.getFullYear()
        );
    });

    useEffect(() => {
        getSchedule();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            { 
            scheduleToday.length === 0 
            ?
            (<p>You haven't added your schedule for today</p>)
            :
            (scheduleToday.map((element, index) => (
                <Container key={index} className="d-flex">
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            {element.time[0]} - {element.time[1]}
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Text input with checkbox"
                            value={element.event}
                            style={{ pointerEvents: "none" }}
                            readOnly
                        />
                        {/* <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                                handleShowModal(setEditSchedule)
                                setSelectedScheduleId(element._id)
                            }}
                        >
                            <CiEdit />
                        </Button> */}
                        <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => deleteSchedule(element._id, index)}
                        >
                            x
                        </Button>
                    </InputGroup>
                </Container>
            )))}

            <EditSchedule
                showModal={editSchedule}
                handleClose={() => handleClose(setEditSchedule)}
                selectedScheduleId={selectedScheduleId}
                setSelectedScheduleId={setSelectedScheduleId}
                getSchedule={getSchedule}
            />

        </div>
    );
}
