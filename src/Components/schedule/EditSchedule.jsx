import React, { useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import "react-datepicker/dist/react-datepicker.css";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css";
import { useSchedule } from "../../context/ScheduleContext";

export default function Schedule({ showModal, handleClose, selectedScheduleId }) {

    const { newSchedule, schedule, handleChangeCreate, getSchedule, editSchedule } = useSchedule()
    // const { user } = useUser();

    const dateRef = useRef()
    const timeRef = useRef()
    const eventRef = useRef()

    async function populateFormFields() {
        try {
            const scheduleToEdit = schedule.find((element) => element._id === selectedScheduleId);

            if (scheduleToEdit) {
                dateRef.current.value = scheduleToEdit.date;
                timeRef.current.value = scheduleToEdit.time;
                eventRef.current.value = scheduleToEdit.event;
            }
        } catch (error) {
            console.error(error);
        }
    }

    

    async function handleSubmit(e) {
        try {
            await editSchedule(selectedScheduleId, {
                date: dateRef.current.value,
                time: timeRef.current.value,
                event: eventRef.current.value,
            });
            handleClose();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (showModal) {
            populateFormFields();
        }
    });

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Form>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Date</Form.Label>
                        <br />
                        <DatePicker
                            selected={newSchedule.date}
                            dateFormat="dd-MM-y"
                            value={newSchedule.date}
                            ref={dateRef}
                            onChange={(date) => handleChangeCreate("date", date)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Time</Form.Label>
                        <br />
                        <TimeRangePicker
                            onChange={(time) => handleChangeCreate("time", time)}
                            ref={timeRef}
                            value={newSchedule.time}
                            disableClock={true}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Event</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            ref={eventRef}
                            value={newSchedule.event}
                            onChange={(e) => handleChangeCreate("event", e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        variant="success"
                        onClick={() => {
                            handleSubmit();
                            getSchedule()
                        }}
                    >
                        Save Edit
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>

    );
}
