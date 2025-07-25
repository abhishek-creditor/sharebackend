// reminders.routes.js
const express = require('express');
const router = express.Router();
const remindersController = require('../../../controllers/calendar/reminders/reminders.controller');

// Create reminder for an event
router.post('/:id/reminders', remindersController.createReminder);

// Get all reminders
router.get('/reminders', remindersController.getAllReminders);

// Update a specific reminder (optional if implemented)
 router.put('/:reminderId', remindersController.updateReminder);

// Delete a specific reminder by event and reminder id
router.delete('/:eventId/reminders/:reminderId', remindersController.deleteReminder);

// Get reminders for an event
router.get('/:eventId', remindersController.getRemindersByEvent);

// Get reminders for a user
router.get('/user/:userId/reminders', remindersController.getRemindersByUser);

module.exports = router;
