const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/calendar/events/event.controller');
const {verifyToken, accessTo} = require('../../../middleware/authMiddleware');
router.use(verifyToken);
// Create Event
router.post('/',accessTo('admin','instructor') ,controller.createEvent);

// Get Events (with optional filters)
router.get('/', controller.getAllEvents); //accessTo('user','admin','instructor')

// Get Event by ID
router.get('/:id',accessTo('admin','instructor'), controller.getEventById);

// Update Event
router.patch('/:id',accessTo('admin','instructor'), controller.updateEvent);

// Delete Event
router.delete('/:id', accessTo('admin','instructor'),controller.deleteEvent);
//get all the events for a particular group
router.get('/groupevent/:groupId', accessTo('admin','instructor'),controller.getEventsByGroup);

router.post('/recurring', accessTo('admin','instructor'),controller.createRecurringEvent);
router.delete('/recurring/:id', controller.deleteRecurringEvent);
router.get('/recurring',accessTo('admin','instructor'), controller.getAllRecurringEvents);
router.get('/:id/recurrence', accessTo('admin','instructor'),controller.getRecurrenceRule);
router.patch('/recurring/:id', accessTo('admin','instructor'),controller.updateRecurringEvent);

// Uncomment for export support
// router.get('/:id/export', controller.exportICal);

module.exports = router;
