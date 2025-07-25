// const calendarDao = require('../../dao/calendarDao');
// const messages = require('../../utils/message');

// module.exports = {
//   async getRecurrenceRule(req, res) {
//     try {
//       const rule = await calendarDao.getRecurrenceRule(req.params.id);
//       if (!rule) return res.status(404).json({ error: 'Recurrence rule not found' });
//       res.status(200).json({ message: messages.EVENTS_FETCHED, data: rule });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: messages.SERVER_ERROR });
//     }
//   }
// };
