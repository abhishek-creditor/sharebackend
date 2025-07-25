
// routes/calendar/participants/participants.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/calendar/participants/participants.controller');

// Add multiple participants to an event
router.post('/:id/participants', controller.addParticipants);

// Add a single participant to an event
router.post('/:eventId/participant', controller.addSingleParticipant);

// Get all participants of an event
router.get('/:eventId/participants', controller.getParticipants);

// Remove a participant from an event
router.delete('/:eventId/participants/:userId', controller.removeParticipant);

module.exports = router;
