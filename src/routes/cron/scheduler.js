// api/events/notifications/scheduler.js
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let io;
const cronJobs = {}; // In-memory store for cron jobs

function setSocketIo(socketIoInstance) {
  io = socketIoInstance;
}

// Helper to send notification
const sendNotification = async (userId, event) => {
  console.log(`Sending notification for event: ${event.title} to user: ${userId}`);
  try {
    const notification = await prisma.notifications.create({
      data: {
        user_id: userId,
        type: 'EVENT_REMINDER',
        title: `Reminder: ${event.title}`,
        message: `Your event "${event.title}" is starting soon.`,
        data: {
          eventId: event.id
        }
      }
    });
    // This requires a mapping of userId to socketId to send to a specific user
    // For now, we'll broadcast to all clients for simplicity
    io.emit('notify', notification);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

async function scheduleEvent(event) {
  // Stop existing job if it exists
  if (cronJobs[event.id]) {
    cronJobs[event.id].stop();
    delete cronJobs[event.id];
  }

  const reminders = await prisma.reminder.findMany({
    where: { eventId: event.id }
  });

  reminders.forEach(reminder => {
    if (event.isRecurring && event.recurrenceRule) {
      const rule = event.recurrenceRule;
      const [hours, minutes] = new Date(reminder.triggerTime).toLocaleTimeString('en-US', { hour12: false }).split(':');
      let cronExp;

      if (rule.frequency === 'DAILY') {
        cronExp = ` ${minutes} ${hours} */${rule.interval} * *`;
      } else if (rule.frequency === 'WEEKLY') {
        const dayOfWeek = new Date(event.startTime).getDay();
        cronExp = ` ${minutes} ${hours} * * ${dayOfWeek}`;
      } else if (rule.frequency === 'MONTHLY') {
        const dayOfMonth = new Date(event.startTime).getDate();
        cronExp = ` ${minutes} ${hours} ${dayOfMonth} */${rule.interval} *`;
      } else if (rule.frequency === 'YEARLY') {
        const dayOfMonth = new Date(event.startTime).getDate();
        const month = new Date(event.startTime).getMonth() + 1;
        cronExp = ` ${minutes} ${hours} ${dayOfMonth} ${month} */${rule.interval}`;
      }

      const job = cron.schedule(cronExp, async () => {
        const now = new Date();
        if (rule.endDate && now > new Date(rule.endDate)) {
          job.stop();
          delete cronJobs[event.id];
          return;
        }

        if (rule.frequency === 'WEEKLY') {
          const start = new Date(event.startTime);
          const diffWeeks = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
          if (diffWeeks % rule.interval !== 0) {
            return;
          }
        }

        await sendNotification(reminder.userId, event);
      });
      cronJobs[event.id] = job;

    } else {
      // One-time event
      const triggerTime = new Date(reminder.triggerTime);
      if (triggerTime > new Date()) {
        const job = cron.schedule(triggerTime, async () => {
          await sendNotification(reminder.userId, event);
          delete cronJobs[event.id]; // one-time job, remove after execution
        });
        cronJobs[event.id] = job;
      }
    }
  });
}

function unscheduleEvent(eventId) {
  if (cronJobs[eventId]) {
    cronJobs[eventId].stop();
    delete cronJobs[eventId];
    console.log(`Unscheduled event: ${eventId}`);
  }
}

async function initializeScheduler() {
  console.log('Initializing scheduler...');
  const events = await prisma.event.findMany({
    include: {
      recurrenceRule: true,
      reminder: true,
    },
    where: {
      OR: [
        { endTime: { gte: new Date() } },
        { isRecurring: true }
      ]
    }
  });

  for (const event of events) {
    if (event.reminder && event.reminder.length > 0) {
      console.log(`Scheduling event: ${event.title}`);
      scheduleEvent(event);
    }
  }
}

// 🟢 generateOccurrences to return occurrences within date range
function generateOccurrences(event, startDate, endDate) {
  if (!event.recurrenceRule) {
    // Non-recurring: return single occurrence if in range
    if (new Date(event.startTime) >= startDate && new Date(event.startTime) <= endDate) {
      return [new Date(event.startTime)];
    }
    return [];
  }

  const { frequency, interval, endDate: ruleEndDate } = event.recurrenceRule;
  const occurrences = [];
  let current = new Date(event.startTime);

  const frequencyMs = {
    DAILY: 24 * 60 * 60 * 1000,
    WEEKLY: 7 * 24 * 60 * 60 * 1000,
    MONTHLY: 30 * 24 * 60 * 60 * 1000,
    YEARLY: 365 * 24 * 60 * 60 * 1000,
  }[frequency];

  if (!frequencyMs) return [];

  const effectiveEndDate = ruleEndDate ? new Date(ruleEndDate) : endDate;

  while (current <= effectiveEndDate) {
    if (current >= startDate && current <= endDate) {
      occurrences.push(new Date(current));
    }
    current = new Date(current.getTime() + frequencyMs * interval);
  }

  return occurrences;
}

module.exports = {
  setSocketIo,
  scheduleEvent,
  unscheduleEvent,
  initializeScheduler,
  generateOccurrences
};
