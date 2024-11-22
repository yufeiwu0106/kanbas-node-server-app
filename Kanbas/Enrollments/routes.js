import * as dao from "./dao.js";

export default function EnrollmentsRoutes(app) {
    app.get("/api/enrollments", (req, res) => {
        const enrollments = dao.findAllEnrollments();
        res.send(enrollments);
    });
    
    app.delete("/api/enrollments/:enrollmentId", (req, res) => {
        const { enrollmentId } = req.params;
        dao.deleteEnrollment(enrollmentId);
        res.sendStatus(204);
    });
}