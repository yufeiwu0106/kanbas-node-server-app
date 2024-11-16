import * as dao from "./dao.js";

let currentUser = null;

export default function UserRoutes(app) {
  const createUser = (req, res) => {};
  const deleteUser = (req, res) => {};
  const signout = (req, res) => {};

  app.post("/api/users", createUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signout", signout);

  // sign in
  const signin = (req, res) => {
    console.log(req);

    const { username, password } = req.body;

    // update global currentUser to reflect the signed in user
    currentUser = dao.findUserByCredentials(username, password);
    res.json(currentUser);
  };

  app.post("/api/users/signin", signin);

  // sign up
  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    currentUser = dao.createUser(req.body);
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
    currentUser = dao.findUserById(userId);
    res.json(currentUser);
  };

  app.put("/api/users/:userId", updateUser);

  // profile
  const profile = (req, res) => {
    res.json(currentUser);
  };

  app.post("/api/users/profile", profile);

  // find user by id
  const findUserById = (req, res) => {
    // const userId = req.body;
    // const user = dao.findUserById(userId);
    // console.log(user);
    // res.json(user);
  };

  app.get("/api/users/:userId", findUserById);
}
