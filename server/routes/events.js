// routes/events.js
import express from 'express';
import passport from 'passport';
import Event from '../models/Event.js';

const router = express.Router();

/**
 * @route GET /api/events
 * @description Get all non-deleted historical notifications, sorted by newest first.
 * @access Private (requires JWT authentication)
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Fetch all events that have not been soft-deleted
      const allHistoricalNotifications = await Event.find({ deleted: false }).sort({
        createdAt: -1,
      });

      // Send the formatted events as a JSON response
      res.json(allHistoricalNotifications);
    } catch (err) {
      // Handle server errors
      res.status(500).json({ message: err.message });
    }
  }
);

// The other routes (POST, PUT, DELETE) remain unchanged.

/**
 * @route POST /api/events
 * @description Create a new event.
 * @access Private (requires JWT authentication)
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { title, description, severity } = req.body;
    try {
      const newEvent = new Event({ title, description, severity });
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (err) {
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
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(updatedEvent);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/**
 * @route DELETE /api/events
 * @description Soft-delete all events.
 * @access Private (requires JWT authentication)
 */
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Use soft-delete instead of permanent deletion
      await Event.updateMany({}, { $set: { deleted: true } });
      res.json({ message: 'All historical events cleared' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;