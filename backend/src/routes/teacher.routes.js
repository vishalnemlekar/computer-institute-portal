const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../config/upload');
const teacherController = require('../controllers/teacher.controller');


router.get(
  '/dashboard',
  authMiddleware(['teacher']),
  (req, res) => {
    res.json({ message: 'Teacher dashboard working' });
  }
);

router.post(
  '/materials',
  authMiddleware(['teacher']),
  upload.single('file'),
  teacherController.uploadMaterial
);

router.post(
  '/notices',
  authMiddleware(['teacher']),
  teacherController.createNotice
);

router.post(
  '/results',
  authMiddleware(['teacher']),
  teacherController.enterResult
);


module.exports = router;
