import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  // sign in
  const signin = async (req, res) => {
    const { username, password } = req.body;

    // update global currentUser to reflect the signed in user
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  app.post("/api/users/signin", signin);

  // sign up
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  app.post("/api/users/signup", signup);

  // find all users
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }

    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const allUsers = await dao.findAllUsers();
    res.json(allUsers);
  };

  app.get("/api/users", findAllUsers);

  // Update user
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];

    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }

    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  app.put("/api/users/:userId", updateUser);

  // profile
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    res.json(currentUser);
  };

  app.post("/api/users/profile", profile);

  // signout
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  app.post("/api/users/signout", signout);

  // retrieve courses the current user is enrolled in
  const findCoursesForEnrolledUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    if (currentUser.role === "ADMIN") {
      const courses = await courseDao.findAllCourses();
      res.json(courses);
      return;
    }
    let { userId } = req.params;
    if (userId === "current") {
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  // Enroll user in the course
  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);

  // Unenroll user from the course
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  // Create course
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  app.post("/api/users/current/courses", createCourse);

  // find user by id
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  app.get("/api/users/:userId", findUserById);

  // delete user
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  app.delete("/api/users/:userId", deleteUser);

  // create user
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  app.post("/api/users", createUser);
}
