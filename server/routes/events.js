import express from 'express';
import passport from 'passport';
import Event from '../models/Event.js';

const router = express.Router();

// Get all events
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      res.json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Create a new event
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

// Mark an event as read
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

// Clear all events
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Event.deleteMany({});
      res.json({ message: 'All events cleared' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
