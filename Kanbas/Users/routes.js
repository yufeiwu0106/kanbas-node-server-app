import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  const createUser = (req, res) => {};
  const deleteUser = (req, res) => {};

  app.post("/api/users", createUser);
  app.delete("/api/users/:userId", deleteUser);

  // sign in
  const signin = (req, res) => {
    const { username, password } = req.body;

    // update global currentUser to reflect the signed in user
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  app.post("/api/users/signin", signin);

  // sign up
  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  app.post("/api/users/signup", signup);

  // find all users
  const findAllUsers = (req, res) => {
    const allUsers = dao.findAllUsers();
    res.json(allUsers);
  };

  app.get("/api/users", findAllUsers);

  // Update user
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);

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
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  // Create course
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  
  app.post("/api/users/current/courses", createCourse);
  
  // find user by id
  const findUserById = (req, res) => {
    // const userId = req.body;
    // const user = dao.findUserById(userId);
    // console.log(user);
    // res.json(user);
  };

  app.get("/api/users/:userId", findUserById);
}
