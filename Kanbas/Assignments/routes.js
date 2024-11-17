import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // update assignment
  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    
    console.log("assignmentId, ", assignmentId);
    console.log("assignmentUpdates, ", assignmentUpdates);

    assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
    res.sendStatus(204);
  });

  // delete assignment
  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    assignmentsDao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  });
}
