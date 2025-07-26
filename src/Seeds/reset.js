const prisma = require("../config/prismaClient");


async function resetDatabase() {
  try {
    // Delete in reverse dependency order to avoid FK constraint issues

    await prisma.quiz_question_responses.deleteMany();
    await prisma.question_options.deleteMany();
    await prisma.user_quiz_attempts.deleteMany();
    await prisma.quiz_questions.deleteMany();
    await prisma.quizzes.deleteMany();

    await prisma.assignment_submission.deleteMany();
    await prisma.assignments.deleteMany();

    await prisma.user_lesson_progress.deleteMany();
    await prisma.user_module_progress.deleteMany();

    await prisma.lesson_resource.deleteMany();
    await prisma.lessons.deleteMany();
    await prisma.units.deleteMany();
    await prisma.modules.deleteMany();

    await prisma.catalog_courses.deleteMany();
    await prisma.user_catalog_access.deleteMany();
    await prisma.user_course_access.deleteMany();
    await prisma.catalogs.deleteMany();

    await prisma.order_items.deleteMany();
    await prisma.orders.deleteMany();

    await prisma.course_reviews.deleteMany();
    await prisma.course_admins.deleteMany();
    await prisma.course_instructors.deleteMany();
    await prisma.courses.deleteMany();

    await prisma.chat_message.deleteMany();
    await prisma.conversations.deleteMany();

    await prisma.logs.deleteMany();
    await prisma.notifications.deleteMany();
    await prisma.contactus.deleteMany();

    await prisma.chatbot_questions.deleteMany();
    await prisma.chatbot_sections.deleteMany();

    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.group_post.deleteMany();
    await prisma.group_member.deleteMany();
    await prisma.group_message.deleteMany();
    await prisma.groups.deleteMany();

    await prisma.user_roles.deleteMany();
    await prisma.users.deleteMany();

    
    await prisma.recurrence_rule.deleteMany();
    await prisma.event_participant.deleteMany();
    await prisma.reminder.deleteMany();
    await prisma.event.deleteMany();
    


    console.log('All data deleted successfully');
  } catch (err) {
    console.error('Failed to delete data:', err);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
