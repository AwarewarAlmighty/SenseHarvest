// import express from 'express';
// import passport from 'passport';
// import Event from '../models/Event.js';

// const router = express.Router();

// // Get all events
// router.get(
//   '/',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       const events = await Event.find().sort({ createdAt: -1 });
//       res.json(events);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// // Create a new event
// router.post(
//   '/',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     const { title, description, severity } = req.body;
//     try {
//       const newEvent = new Event({ title, description, severity });
//       const savedEvent = await newEvent.save();
//       res.status(201).json(savedEvent);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   }
// );

// // Mark an event as read
// router.put(
//   '/:id/read',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       const updatedEvent = await Event.findByIdAndUpdate(
//         req.params.id,
//         { read: true },
//         { new: true }
//       );
//       if (!updatedEvent) {
//         return res.status(404).json({ message: 'Event not found' });
//       }
//       res.json(updatedEvent);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// // Clear all events
// router.delete(
//   '/',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       await Event.deleteMany({});
//       res.json({ message: 'All events cleared' });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// export default router;
// routes/events.js
import express from 'express';
import passport from 'passport'; // Assuming passport and its strategies are configured
import Event from '../models/Event.js'; // Your updated Event model

const router = express.Router();

/**
 * @route GET /api/events
 * @description Get the 3 newest historical notifications for 'critical', 'warning', and 'normal/info' severities.
 * @access Private (requires JWT authentication)
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
       const limit = 3;
      // Add { deleted: false } to your queries
      const [criticalEvents, warningEvents, infoEvents] = await Promise.all([
        Event.find({ severity: 'critical', deleted: false }).sort({ createdAt: -1 }).limit(limit),
        Event.find({ severity: 'warning', deleted: false }).sort({ createdAt: -1 }).limit(limit),
        Event.find({ severity: { $in: ['info', 'normal'] }, deleted: false }).sort({ createdAt: -1 }).limit(limit),
      ]);

      // Combine all fetched events and sort them by creation date (newest first)
      const allHistoricalNotifications = [
        ...criticalEvents,
        ...warningEvents,
        ...infoEvents,
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Format the events to match the frontend's Notification interface
      const formattedNotifications = allHistoricalNotifications.map(event => ({
        _id: event._id.toString(),
        title: event.title,
        description: event.description,
        createdAt: event.createdAt.toISOString(),
        severity: event.severity === 'normal' ? 'info' : event.severity, // Map 'normal' to 'info' for frontend display
        read: true, // Historical data fetched from API is considered 'read'
        action: 'View Details', // Example action, adjust as needed
      }));

      res.json(formattedNotifications);
    } catch (err) {
      console.error('Error fetching events:', err.message);
      res.status(500).json({ message: 'Server error fetching events' });
    }
  }
);

/**
 * @route POST /api/events
 * @description Create a new event.
 * @access Private (requires JWT authentication)
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { title, description, severity, sensorId, value } = req.body; // Added sensorId and value
    try {
      const newEvent = new Event({
        title,
        description,
        severity,
        sensorId, // Save sensor-specific data if provided
        value,    // Save sensor-specific data if provided
        read: false, // New events are unread by default
      });
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (err) {
      console.error('Error creating event:', err.message);
      res.status(400).json({ message: err.message });
    }
  }
);

/**
 * @route PUT /api/events/:id/read
 * @description Mark an event as read.
 * @access Private (requires JWT authentication)
 */
router.put(
  '/:id/read',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true } // Return the updated document
      );
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(updatedEvent);
    } catch (err) {
      console.error('Error marking event as read:', err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

/**
 * @route DELETE /api/events
 * @description Clear all events from the database.
 * @access Private (requires JWT authentication)
 */
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Mark all events as deleted instead of removing them
      await Event.updateMany({}, { $set: { deleted: true } });
      res.json({ message: 'All historical events marked as cleared' });
    } catch (err) {
      console.error('Error marking events as cleared:', err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;