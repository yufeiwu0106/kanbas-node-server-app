import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });

  // Create a new course
  app.post("/api/courses", async (req, res) => {
    const course = await dao.createCourse(req.body);

    const currentUser = req.session["currentUser"];
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    }

    res.json(course);
  });

  // Delete a course
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);

    // Fix logic to send status code: 'ERR_HTTP_INVALID_STATUS_CODE'
    if (status.deletedCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });

  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);

    if (status.modifiedCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });

  // Get modules for a course
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  // Create a new module
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  });

  // get assignments by course id
  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignments = await assignmentsDao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  });

  // create assignment
  app.post("/api/courses/:courseId/assignments", async(req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };

    console.log("req.body, ", req.body);
    console.log("assignment, ", assignment);

    const newAssignment = await assignmentsDao.createAssignment(assignment);

    res.send(newAssignment);
  });

  // get enrollments by course id
  app.get("/api/courses/:courseId/enrollments", (req, res) => {
    const { courseId } = req.params;
    const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  });

  // enroll user in course
  app.post("/api/courses/:courseId/enrollments", (req, res) => {
    const { courseId } = req.params;
    const { userId } = req.body;
    const enrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  });

  // get users for course
  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  });
}
