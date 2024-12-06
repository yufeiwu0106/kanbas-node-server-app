import model from "./model.js";

export function findAllEnrollments() {
  return model.find();
}

export function findEnrollmentsForCourse(course) {
  const enrollments = model.find({ course: course }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}

// find courses for a user
export async function findCoursesForUser(user) {
  const enrollments = await model.find({ user: user }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

// find users for a course
export async function findUsersForCourse(course) {
  const enrollments = await model.find({ course: course }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}

// enroll user in course
export function enrollUserInCourse(user, course) {
  return model.create({ user, course });
}

// unenroll user from course
export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}
