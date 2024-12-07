import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // update assignment
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    
    const status = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);

    if (status.modifiedCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });

  // delete assignment
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const status = await assignmentsDao.deleteAssignment(assignmentId);
    
    if (status.deletedCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });
}
