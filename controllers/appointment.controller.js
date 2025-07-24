// Controllers for appointment-related routes

// POST api/appointments
// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const appointmentData = req.body;
        const appointment = await createAppointmentService(appointmentData);
        res.status(201).json(appointment);
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}