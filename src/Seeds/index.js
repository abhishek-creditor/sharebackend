const prisma = require("../config/prismaClient");

// User-related seeds
const { seedUsers } = require('./AllSeedsFiles/users.seed');
const { seedUserRoles } = require('./AllSeedsFiles/user_roles.seed');

// Course-related seeds
const { seedCourses } = require('./AllSeedsFiles/courses.seed');
const { seedCourseAdmins } = require('./AllSeedsFiles/course_admins.seed');
const { seedCourseInstructors } = require('./AllSeedsFiles/course_instructors.seed');
const { seedCourseReviews } = require('./AllSeedsFiles/course_reviews.seed');

// Catalog-related
const { seedCatalogs } = require('./AllSeedsFiles/catalogs.seed');
const { seedCatalogCourses } = require('./AllSeedsFiles/catalog_courses.seed');
const { seedUserCatalogAccess } = require('./AllSeedsFiles/user_catalog_access.seed');
const { seedUserCourseAccess } = require('./AllSeedsFiles/user_course_access.seed');

// Module / Unit / Lesson
const { seedModules } = require('./AllSeedsFiles/modules.seed');
const { seedUnits } = require('./AllSeedsFiles/units.seed');
const { seedLessons } = require('./AllSeedsFiles/lessons.seed');
const { seedLessonResources } = require('./AllSeedsFiles/lesson_resource.seed');
const { seedUserModuleProgress } = require('./AllSeedsFiles/user_module_progress.seed');
const { seedUserLessonProgress } = require('./AllSeedsFiles/user_lesson_progress.seed');

// Assignments
const { seedAssignments } = require('./AllSeedsFiles/assignments.seed');
const { seedAssignmentSubmissions } = require('./AllSeedsFiles/assignmentSubmission.seed');

// Quizzes
const { seedQuizzes } = require('./AllSeedsFiles/quizzes.seed');
const { seedQuizQuestions } = require('./AllSeedsFiles/quiz_questions.seed');
const { seedQuestionOptions } = require('./AllSeedsFiles/question_options.seed');
const { seedUserQuizAttempts } = require('./AllSeedsFiles/user_quiz_attempts.seed');
const { seedQuizQuestionResponses } = require('./AllSeedsFiles/quiz_question_responses.seed');

// Orders
const { seedOrders } = require('./AllSeedsFiles/orders.seed');
const { seedOrderItems } = require('./AllSeedsFiles/order_items.seed');

// Conversations / Chat
const { seedConversations } = require('./AllSeedsFiles/conversations.seed');
const { seedChatMessages } = require('./AllSeedsFiles/chat_messages.seed');

// Logs / Notifications / Contact
const { seedLogs } = require('./AllSeedsFiles/logs.seed');
const { seedNotifications } = require('./AllSeedsFiles/notifications.seed');
const { seedContactUs } = require('./AllSeedsFiles/contactus.seed');

// Chatbot
const { seedChatbotSections } = require('./AllSeedsFiles/chatbot_sections.seed');
const { seedChatbotQuestions } = require('./AllSeedsFiles/chatbot_questions.seed');

// Groups
const { seedGroups } = require('./AllSeedsFiles/groups.seed');
const { seedGroupMembers } = require('./AllSeedsFiles/group_member.seed');
const { seedGroupPosts } = require('./AllSeedsFiles/group_post.seed');
const { seedComments } = require('./AllSeedsFiles/comment.seed');
const { seedLikes } = require('./AllSeedsFiles/like.seed');
const { seedGroupMessages } = require('./AllSeedsFiles/group_message.seed');
const { seedEvents} = require('./AllSeedsFiles/event.seed');


async function main() {
  
  await seedUsers();
  await seedUserRoles();

  await seedCatalogs();

  await seedCourses();
  await seedCourseAdmins();
  await seedCourseInstructors();
  await seedCourseReviews();

  
  await seedCatalogCourses();
  await seedUserCatalogAccess();
  await seedUserCourseAccess();

  await seedModules();
  await seedUnits();
  await seedLessons();
  await seedLessonResources();
  await seedUserModuleProgress();
  await seedUserLessonProgress();

  await seedAssignments();
  await seedAssignmentSubmissions(); 

  await seedQuizzes();
  await seedQuizQuestions();
  await seedQuestionOptions();
  await seedUserQuizAttempts();
  await seedQuizQuestionResponses();

  await seedOrders();
  await seedOrderItems();

  await seedConversations();
  await seedChatMessages();

  await seedLogs();
  await seedNotifications(); //mig
  await seedContactUs();

  await seedChatbotSections();
  await seedChatbotQuestions();

  await seedGroups();
  await seedGroupMembers();
  await seedGroupPosts();
  await seedComments();
  await seedLikes();
  await seedGroupMessages();
  await seedEvents();
}

main()
  .then(() => {
    console.log('All seed data inserted');
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
