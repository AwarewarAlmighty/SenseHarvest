import express from 'express';
import passport from 'passport';
import Employee from '../models/Employee.js';
import User from '../models/User.js'; // Assuming you have a User model

const router = express.Router();

// Middleware to check for admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

// Card tap login
router.post('/login', async (req, res) => {
  const { cardId } = req.body;
  try {
    const employee = await Employee.findOne({ cardId });
    if (employee) {
      // For now, just return the employee. Later, we'll implement session management.
      res.json({ message: 'Login successful', employee });
    } else {
      // Later, this will trigger a notification to the admin.
      console.log(`Unregistered card tapped: ${cardId}`);
      res.status(404).json({ message: 'Card not registered' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new employee (admin only)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  async (req, res) => {
    const { cardId, name, role } = req.body;
    try {
      const newEmployee = new Employee({ cardId, name, role });
      const savedEmployee = await newEmployee.save();
      res.status(201).json(savedEmployee);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Get all employees (admin only)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const employees = await Employee.find();
      res.json(employees);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete an employee (admin only)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
