const db = require('../config/db');

exports.getMaterials = (req, res) => {
  const { teacherCode } = req.params;

  const sql = `
    SELECT m.id, m.title, m.file_path, c.course_name
    FROM materials m
    JOIN courses c ON m.course_id = c.id
    JOIN teachers t ON m.teacher_id = t.id
    WHERE t.teacher_code = ?
  `;

  db.query(sql, [teacherCode], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.getResults = (req, res) => {
  const studentUserId = req.user.id;

  const sql = `
    SELECT c.course_name, r.marks, r.status
    FROM results r
    JOIN courses c ON r.course_id = c.id
    JOIN students s ON r.student_id = s.id
    WHERE s.user_id = ?
  `;

  db.query(sql, [studentUserId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.getNotices = (req, res) => {
  const { teacherCode } = req.params;

  const sql = `
    SELECT n.id, n.content, n.priority, n.created_at
    FROM notices n
    JOIN teachers t ON n.teacher_id = t.id
    WHERE t.teacher_code = ?
    ORDER BY n.created_at DESC
  `;

  db.query(sql, [teacherCode], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

