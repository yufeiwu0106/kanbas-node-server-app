import * as dao from "./dao.js";

export default function EnrollmentsRoutes(app) {
    app.delete("/api/enrollments/:enrollmentId", (req, res) => {
        const { enrollmentId } = req.params;
        dao.deleteEnrollment(enrollmentId);
        res.sendStatus(204);
    });
}