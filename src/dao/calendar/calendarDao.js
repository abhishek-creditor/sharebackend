const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const scheduler = require('../../routes/cron/scheduler');

//  Standalone function getAllEvents
async function getAllEvents(filters) {
  const events = await prisma.event.findMany({
    where: filters,
    include: {
      recurrenceRule: true,
    },
  });

  return events.map((event) => {
    if (event.recurrenceRule) {
      const occurrences = scheduler.generateOccurrences(
        event,
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );
      event.occurrences = occurrences;
    }
    return event;
  });
}

//  Standalone function listEvents
async function listEvents() {
  const events = await prisma.event.findMany({
    include: {
      recurrenceRule: true,
    },
  });

  return events.map((event) => {
    if (event.recurrenceRule) {
      const occurrences = scheduler.generateOccurrences(
        event,
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );
      event.occurrences = occurrences;
    }
    return event;
  });
}

module.exports = {
  createEvent: async (data) => {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        // timeZone: data.timeZone,
        creatorId: data.creatorId,
        groupId: data.groupId,
        calendarType: data.calendarType,
        visibility: data.visibility,
        course_id: data.course_id,
        recurrenceRule: data.recurrenceRule
          ? {
              create: {
                frequency: data.recurrenceRule.frequency,
                interval: data.recurrenceRule.interval,
                endDate: data.recurrenceRule.endDate,
              },
            }
          : undefined,
      },
      include: {
        recurrenceRule: true,
      },
    });
  },
 
  getUserRoles: async(user_id)=>{
    return await prisma.user_roles.findMany({
      where:{user_id},
    });
  },

  getEventById: async (eventId) => {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        recurrenceRule: true,
      },
    });

    if (event && event.recurrenceRule) {
      const occurrences = scheduler.generateOccurrences(
        event,
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );
      event.occurrences = occurrences;
    }

    return event;
  },

  updateEvent: async (eventId, data) => {
    return prisma.event.update({
      where: { id: eventId },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        // timeZone: data.timeZone,
        groupId: data.groupId,
        recurrenceRule: data.recurrenceRule
          ? {
              upsert: {
                create: {
                  frequency: data.recurrenceRule.frequency,
                  interval: data.recurrenceRule.interval,
                  endTime: data.recurrenceRule.endTime,
                },
                update: {
                  frequency: data.recurrenceRule.frequency,
                  interval: data.recurrenceRule.interval,
                  endTime: data.recurrenceRule.endTime,
                },
              },
            }
          : undefined,
      },
      include: {
        recurrenceRule: true,
      },
    });
  },

  deleteEvent: async (eventId) => {
    // Remove it once cascading delete is done
    // await prisma.recurrence_rule.deleteMany({
    //   where: { eventId },
    // });
    // await prisma.event_participant.deleteMany({
    //   where: { eventId },
    // });
    // await prisma.reminder.deleteMany({
    //   where: { eventId },
    // });

    // return prisma.event.delete({
    //   where: { id: eventId },
    // });
    const exists = await prisma.event.findUnique({ where: { id: eventId } });

    if (!exists) {
    throw new Error(`Event with ID ${eventId} not found.`);
    }
    return prisma.event.delete({
    where: { id: eventId },
});

  },

  createRecurringEvent: async (data) => {
    return prisma.event.create({
      data: {
        ...data,
        recurrenceRule: {
          create: data.recurrenceRule,
        },
      },
      include: { recurrenceRule: true },
    });
  },

  deleteRecurringEvent: async (eventId) => {
    // return prisma.event.delete({
    //   where: { id: eventId },
    // });
    const exists = await prisma.event.findUnique({ where: { id: eventId } });

  if (!exists) {
    throw new Error(`Event with ID ${eventId} not found.`);
  }

  return prisma.event.delete({ where: { id: eventId } });
  },
  
  // Remove it once cascading delete is done
//   deleteRecurringEvent: async (eventId) => {
//     return prisma.$transaction([
//     prisma.recurrence_rule.deleteMany({
//       where: { eventId: eventId },
//     }),
//     prisma.event.delete({
//       where: { id: eventId },
//     }),
//   ])
// },

  getAllRecurringEvents: async () => {
    return prisma.event.findMany({
      where: {
        recurrenceRule: { isNot: null },
      },
      include: { recurrenceRule: true },
    });
  },

  getRecurrenceRule: async (eventId) => {
    return prisma.recurrence_rule.findUnique({
      where: { eventId: eventId },
    });
  },
  //remove it once cascading is done 
  // updateRecurringEvent: async (eventId, data) => {
  //   const { recurrenceRule, ...eventData } = data;

  //   const updatedEvent = await prisma.event.update({
  //     where: { id: parseInt(eventId) },
  //     data: eventData,
  //     include: { recurrenceRule: true },
  //   });

  //   if (recurrenceRule) {
  //     await prisma.recurrenceRule.update({
  //       where: { eventId: eventId },
  //       data: recurrenceRule,
  //     });
  //   }

  //   return prisma.event.findUnique({
  //     where: { id: eventId },
  //     include: { recurrenceRule: true },
  //   });
  // },

updateRecurringEvent: async (eventId, data) => {
  const { recurrenceRule, ...eventData } = data;

  // Update the event
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: eventData,
    include: { recurrenceRule: true },
  });

  // Update the recurrence rule if provided
  if (recurrenceRule) {
    await prisma.recurrence_rule.update({
      where: { eventId: eventId },
      data: recurrenceRule,
    });
  }

  // Return the updated event
  return prisma.event.findUnique({
    where: { id: eventId },
    include: { recurrenceRule: true },
  });
},
getUserById: async (userId) => {
  return prisma.users.findUnique({
    where: { id: userId },
  });
},
addParticipants: async (eventId, participants) => {
  return prisma.event_participant.createMany({
    data: participants.map((p) => ({
      eventId: eventId,
      userId: p.userId,
      role: p.role || "VIEWER",
    })),
    skipDuplicates: true,
  });
},
removeParticipant: async (eventId, userId) => {
  return prisma.event_participant.delete({
    where: {
      eventId_userId: {
        eventId: eventId,
        userId: userId,
      },
    },
  });
},
getParticipants: async (eventId) => {
  return prisma.event_participant.findMany({
    where: { eventId },
    include: {
      user: true,  
    },
  });
},
createReminder: async (data) => {
  return prisma.reminder.create({
    data: {
      eventId: data.eventId,
      userId: data.userId,
      triggerTime: data.triggerTime,
      method: data.method,
    },
  });
},
deleteReminder: async (reminderId) => {
  return prisma.reminder.delete({
    where: { id: reminderId },
  });
},
getAllReminders: async (eventId) => {
  return prisma.reminder.findMany({
    where: { eventId },
    orderBy: { triggerTime: 'asc' },
  });
},
 updateReminder: async (reminderId, data) => {
    return prisma.reminder.update({
      where: { id: reminderId },
      data,
    });
  },
 getRemindersByEvent: async (eventId) => {
    return prisma.reminder.findMany({
      where: {
        eventId: eventId,
      },
    });
  },
  getUserCourseAccess: async (userId) => {
  return prisma.user_course_access.findMany({
    where: { user_id : userId},
    select: { course_id: true },
  });
},

getCourseIdByName: async (courseName) => {
  const course = await prisma.courses.findFirst({
    where: {
      title: {
        equals: courseName,
        mode: "insensitive", 
      },
    },
    select: { id: true },
  });
  
  return course ? course.id : null;
},


  // Standalone helpers
  listEvents,
  getAllEvents,
};
