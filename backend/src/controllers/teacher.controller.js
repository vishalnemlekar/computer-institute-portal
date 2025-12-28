const db = require('../config/db');

exports.uploadMaterial = (req, res) => {
  const { title, course_id } = req.body;
  const teacherUserId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: 'File is required' });
  }

  // Get teacher_id using user_id
  db.query(
    'SELECT id FROM teachers WHERE user_id = ?',
    [teacherUserId],
    (err, teacherResult) => {
      if (err || teacherResult.length === 0)
        return res.status(400).json({ message: 'Teacher not found' });

      const teacherId = teacherResult[0].id;

      db.query(
        `INSERT INTO materials (title, file_path, course_id, teacher_id)
         VALUES (?, ?, ?, ?)`,
        [title, req.file.path, course_id, teacherId],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({ message: 'Material uploaded successfully' });
        }
      );
    }
  );
};

exports.createNotice = (req, res) => {
  const { content, priority } = req.body;
  const teacherUserId = req.user.id;

  db.query(
    'SELECT id FROM teachers WHERE user_id = ?',
    [teacherUserId],
    (err, teacherResult) => {
      if (err || teacherResult.length === 0)
        return res.status(400).json({ message: 'Teacher not found' });

      const teacherId = teacherResult[0].id;

      db.query(
        'INSERT INTO notices (content, priority, teacher_id) VALUES (?,?,?)',
        [content, priority || 'low', teacherId],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({ message: 'Notice created successfully' });
        }
      );
    }
  );
};

exports.enterResult = (req, res) => {
  const { student_id, course_id, marks } = req.body;
  const teacherUserId = req.user.id;

  if (!student_id || !course_id || marks === undefined) {
    return res.status(400).json({ message: 'All fields required' });
  }

  // Step 1: Get teacher_id from logged-in teacher
  db.query(
    'SELECT id FROM teachers WHERE user_id = ?',
    [teacherUserId],
    (err, teacherResult) => {
      if (err || teacherResult.length === 0) {
        return res.status(400).json({ message: 'Teacher not found' });
      }

      const teacherId = teacherResult[0].id;

      // Step 2: Verify course belongs to this teacher
      db.query(
        'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
        [course_id, teacherId],
        (err2, courseResult) => {
          if (err2 || courseResult.length === 0) {
            return res.status(403).json({
              message: 'You are not authorized to add results for this course'
            });
          }

          const status = marks >= 40 ? 'Pass' : 'Fail';

          // Step 3: Insert result
          db.query(
            `INSERT INTO results (student_id, course_id, marks, status)
             VALUES (?, ?, ?, ?)`,
            [student_id, course_id, marks, status],
            (err3) => {
              if (err3) return res.status(500).json(err3);

              res.json({ message: 'Result entered successfully' });
            }
          );
        }
      );
    }
  );
};

