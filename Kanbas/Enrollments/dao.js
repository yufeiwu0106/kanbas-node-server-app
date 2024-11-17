import Database from "../Database/index.js";

export function findEnrollmentsForCourse(courseId) {
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.course === courseId);
}

export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  const enrollment = { _id: Date.now(), user: userId, course: courseId };

  enrollments.push(enrollment);

  return enrollment;
}

export function deleteEnrollment(enrollmentId) {
  const { enrollments } = Database;
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment._id !== enrollmentId
  );
}