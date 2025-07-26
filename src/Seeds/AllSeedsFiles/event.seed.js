// seeds/event.seed.js

const prisma = require("../../config/prismaClient");

async function seedEvents() {
  try {
    // Create events
    await prisma.event.createMany({
      data: [
        {
          id: "event-1",
          title: "Frontend Workshop",
          description: "Interactive React.js workshop.",
          startTime: new Date("2025-07-01T10:00:00Z"),
          endTime: new Date("2025-07-01T12:00:00Z"),
          location: "Online",
          isRecurring: true,
          calendarType: "PERSONAL",
          visibility: "PRIVATE",
          creatorId: "userId-1",
          groupId: "group-1"
        },
        {
          id: "event-2",
          title: "Backend Meetup",
          description: "Discuss Node.js and databases.",
          startTime: new Date("2025-07-02T14:00:00Z"),
          endTime: new Date("2025-07-02T16:00:00Z"),
          location: "Zoom",
          isRecurring: false,
          calendarType: "GROUP",
          visibility: "PUBLIC",
          creatorId: "userId-2",
          groupId: "group-2"
        },
        {
          id: "event-3",
          title: "AI Talk",
          description: "Guest speaker on AI ethics.",
          startTime: new Date("2025-07-05T17:00:00Z"),
          endTime: new Date("2025-07-05T18:30:00Z"),
          location: "Auditorium",
          isRecurring: false,
          calendarType: "COURSE",
          visibility: "SHARED",
          creatorId: "userId-3",
          groupId: "group-3"
        },
        {
          id: "event-4",
          title: "DevOps Panel",
          description: "Kubernetes and microservices.",
          startTime: new Date("2025-07-10T11:00:00Z"),
          endTime: new Date("2025-07-10T13:00:00Z"),
          location: "Conference Room B",
          isRecurring: true,
          calendarType: "GROUP",
          visibility: "PUBLIC",
          creatorId: "userId-2",
          groupId: "group-4"
        },
        {
          id: "event-5",
          title: "UX Brainstorming",
          description: "Design sprint planning.",
          startTime: new Date("2025-07-12T09:00:00Z"),
          endTime: new Date("2025-07-12T10:30:00Z"),
          location: "Studio A",
          isRecurring: false,
          calendarType: "PERSONAL",
          visibility: "PRIVATE",
          creatorId: "userId-5",
          groupId: "group-5"
        },
      ],
      skipDuplicates: true
    });

    // Create recurrence rule for event-1
    await prisma.recurrence_rule.createMany({
      data: [
        {
          eventId: "event-1",
          frequency: "WEEKLY",
          interval: 1,
          byDay: "MO",
        },
        {
          eventId: "event-4",
          frequency: "MONTHLY",
          interval: 1,
          endDate: new Date("2025-12-31T00:00:00Z")
        }
      ],
      skipDuplicates: true
    });

    // Create event participants
    await prisma.event_participant.createMany({
      data: [
        { eventId: "event-1", userId: "userId-2", role: "VIEWER" },
        { eventId: "event-2", userId: "userId-3", role: "EDITOR" },
        { eventId: "event-3", userId: "userId-1", role: "HOST" },
        { eventId: "event-4", userId: "userId-2", role: "VIEWER" },
        { eventId: "event-5", userId: "userId-5", role: "HOST" }
      ],
      skipDuplicates: true
    });

    // Create reminders
    await prisma.reminder.createMany({
      data: [
        {
          eventId: "event-1",
          userId: "userId-1",
          triggerTime: new Date("2025-06-30T10:00:00Z"),
          method: "EMAIL"
        },
        {
          eventId: "event-2",
          userId: "userId-2",
          triggerTime: new Date("2025-07-01T14:00:00Z"),
          method: "PUSH"
        },
        {
          eventId: "event-3",
          userId: "userId-3",
          triggerTime: new Date("2025-07-04T17:00:00Z"),
          method: "EMAIL"
        },
        {
          eventId: "event-4",
          userId: "userId-2",
          triggerTime: new Date("2025-07-09T11:00:00Z"),
          method: "PUSH"
        },
        {
          eventId: "event-5",
          userId: "userId-5",
          triggerTime: new Date("2025-07-11T09:00:00Z"),
          method: "EMAIL"
        }
      ],
      skipDuplicates: true
    });

    console.log('Events, recurrence rules, participants, and reminders seeded');
  } catch (err) {
    console.error('Error seeding event-related data:', err);
  }
}



module.exports = { seedEvents };
