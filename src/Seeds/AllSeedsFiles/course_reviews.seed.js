const prisma = require("../../config/prismaClient");

async function seedCourseReviews() {
  try {
    await prisma.course_reviews.createMany({
      data: [
        {
          id: 'review-1',
          user_id: 'userId-2',
          course_id: 'course-1',
          rating: 5,
          comment: 'Excellent course! Learned a lot.',
        },
        {
          id: 'review-2',
          user_id: 'userId-3',
          course_id: 'course-2',
          rating: 4,
          comment: 'Good content but could use more examples.',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Course reviews seeded');
  } catch (err) {
    console.error(' Error seeding course reviews:', err);
  }
}


module.exports = { seedCourseReviews };
