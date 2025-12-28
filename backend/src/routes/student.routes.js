const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const studentController = require('../controllers/student.controller');

router.get(
  '/dashboard',
  authMiddleware(['student']),
  (req, res) => {
    res.json({ message: 'Student dashboard working' });
  }
);

router.get(
  '/materials/:teacherCode',
  authMiddleware(['student']),
  studentController.getMaterials
);

router.get(
  '/results',
  authMiddleware(['student']),
  studentController.getResults
);

router.get(
  '/notices/:teacherCode',
  authMiddleware(['student']),
  studentController.getNotices
);

module.exports = router;
