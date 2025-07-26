const calendarDao = require('../../../dao/calendar/calendarDao');
const messages = require('../../../utils/messages');
const {successResponse , errorResponse} = require('../../../utils/apiResponse');

module.exports = {
  async createEvent(req, res) {
    try {
      let data = { ...req.body };
      if (data.courseName) {
      const courseId = await calendarDao.getCourseIdByName(data.courseName);
      if (!courseId) return errorResponse(req, res, 400, messages.COURSE_NOT_FOUND);
      data.course_id = courseId;
      delete data.courseName;
    }
          const event = await calendarDao.createEvent(data);
      //  res.status(201).json({ message: messages.RESOURCE_CREATED, data: event });
      successResponse(req, res, event, 201, messages.RESOURCE_CREATED);

    } catch (err) {
      console.error(err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);

    }
  },

  async getAllEvents(req, res) {
    try {
      const roles = await calendarDao.getUserRoles(req.user.id);
      const roleNames = roles.map(r => r.role);
      const userId = req.user.id;
      let filters = {};
      
      const courseAccessList = await calendarDao.getUserCourseAccess(userId);
      const accessibleCourseIds = courseAccessList.map(ca => ca.course_id);

      if (roleNames.includes('user')) {
      filters = {
        creatorId: userId,
        course_id: { in: accessibleCourseIds },
      };     
     } else if (roleNames.includes('admin') || roleNames.includes('instructor')) {
        filters.groupId = { not: null };
        if (req.query.groupId) {
          filters.groupId = req.query.groupId; // String, matches cuid
        }
        if (req.query.userId) {
          // return res.status(403).json({
          //   error: "Admins and instructors cannot view individual users' events.",
          // });
          return errorResponse(req,res,403,messages.ADMIN_INSTRUCTOR_CANNOT_ACCESS);
        }
      } else {
        // return res.status(403).json({ error: "Unauthorized role." });
        return errorResponse(req, res, 403, messages.UNAUTHORIZED_ROLE_NOT_FOUND);

      }

      if (req.query.title) {
        filters.title = {
          contains: req.query.title,
          mode: "insensitive",
        };
      }
      if (req.query.startTimeAfter) {
        filters.startTime = { ...filters.startTime, gte: new Date(req.query.startTimeAfter) };
      }
      if (req.query.startTimeBefore) {
        filters.startTime = { ...filters.startTime, lte: new Date(req.query.startTimeBefore) };
      }

      const events = await calendarDao.getAllEvents(filters);
      // res.status(200).json({ message: messages.EVENTS_FETCHED, data: events });
      successResponse(req, res, events, 200, messages.EVENTS_FETCHED);

    } catch (err) {
      console.error(err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);    }
  },

  async getEventById(req, res) {
    try {
      const event = await calendarDao.getEventById(req.params.id);
      if (!event) return errorResponse(req, res, 404, messages.EVENT_NOT_FOUND);
      // res.status(200).json({ message: messages.EVENTS_FETCHED, data: event });
      successResponse(req, res, event, 200, messages.EVENTS_FETCHED);

    } catch (err) {
      console.error(err);
      errorResponse(req, res, 500, messages.SERVER_ERROR);

}
  },

  async updateEvent(req, res) {
    try {
    let data = { ...req.body };
    if (data.courseName) {
      const courseId = await calendarDao.getCourseIdByName(data.courseName);
      if (!courseId) return errorResponse(req, res, 400, messages.COURSE_NOT_FOUND);
      data.courseId = courseId;
      delete data.courseName;
    }
      const updatedEvent = await calendarDao.updateEvent(req.params.id,data);
      // res.status(200).json({ message: messages.RESOURCE_UPDATED, data: updatedEvent });
      successResponse(req, res, updatedEvent, 200, messages.RESOURCE_UPDATED);

    } catch (err) {
      console.error(err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);

    }
  },

  async deleteEvent(req, res) {
    try {
      await calendarDao.deleteEvent(req.params.id);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);

    }
  },

  async getEventsByGroup(req, res) {
    try {
      const { groupId } = req.params;
      const events = await calendarDao.getEventsByGroupId(groupId);
      // res.status(200).json({ message: messages.EVENTS_FETCHED, data: events });
      successResponse(req, res, events, 200, messages.EVENTS_FETCHED);

    } catch (err) {
      console.error('Error in getEventsByGroup:', err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);

    }
  },

  async createRecurringEvent(req, res) {
    try {
    let data = { ...req.body };
    if (data.courseName) {
      const courseId = await calendarDao.getCourseIdByName(data.courseName);
      if (!courseId) return errorResponse(req, res, 400, messages.COURSE_NOT_FOUND);
      data.courseId = courseId;
      delete data.courseName;
    }
      const event = await calendarDao.createRecurringEvent(data);
      // res.status(201).json({ message: messages.RESOURCE_CREATED, data: event });
      successResponse(req, res, event, 201, messages.RESOURCE_CREATED);

    } catch (err) {
      console.error('Error in createRecurringEvent:', err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);

    }
  },

  async deleteRecurringEvent(req, res) {
    try {
      await calendarDao.deleteRecurringEvent(req.params.id);
      res.status(204).end();
    } catch (err) {
      console.error('Error in deleteRecurringEvent:', err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);

    }
  },

  async getAllRecurringEvents(req, res) {
    try {
      const events = await calendarDao.getAllRecurringEvents();
      // res.status(200).json({ message: messages.EVENTS_FETCHED, data: events });
      successResponse(req, res, events, 200, messages.EVENTS_FETCHED);

    } catch (err) {
      console.error('Error in getAllRecurringEvents:', err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);
    }
  },

  async getRecurrenceRule(req, res) {
    try {
      const rule = await calendarDao.getRecurrenceRule(req.params.id);
      if (!rule) return errorResponse(req, res, 404, messages.RECURRENCE_NOT_FOUND);
      // res.status(200).json({ message: messages.EVENTS_FETCHED, data: rule });
      successResponse(req, res, rule, 200, messages.EVENTS_FETCHED);

    } catch (err) {
      console.error('Error in getRecurrenceRule:', err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);

    }
  },

  async updateRecurringEvent(req, res) {
    try {
       let data = { ...req.body };
    if (data.courseName) {
      const courseId = await calendarDao.getCourseIdByName(data.courseName);
      if (!courseId) return errorResponse(req, res, 400, messages.COURSE_NOT_FOUND);
      data.courseId = courseId;
      delete data.courseName;
    }
      const updated = await calendarDao.updateRecurringEvent(req.params.id, data);
      // res.status(200).json({ message: messages.RESOURCE_UPDATED, data: updated });
       successResponse(req, res, updated, 200, messages.RESOURCE_UPDATED);

    } catch (err) {
      console.error('Error in updateRecurringEvent:', err);
      // res.status(500).json({ error: messages.SERVER_ERROR });
      errorResponse(req, res, 500, messages.SERVER_ERROR);

    }
  }
};
