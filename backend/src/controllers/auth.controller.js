const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');

exports.registerStudent = async (req, res) => {
  const { name, email, password, student_id } = req.body;

  if (!name || !email || !password || !student_id) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
    [name, email, hashedPassword, 'student'],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const userId = result.insertId;

      db.query(
        'INSERT INTO students (user_id, student_id) VALUES (?,?)',
        [userId, student_id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.status(201).json({ message: 'Student registered successfully' });
        }
      );
    }
  );
};


exports.registerTeacher = async (req, res) => {
  const { name, email, password, department, teacher_code } = req.body;

  if (!name || !email || !password || !teacher_code) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
    [name, email, hashedPassword, 'teacher'],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const userId = result.insertId;

      db.query(
        'INSERT INTO teachers (user_id, department, teacher_code) VALUES (?,?,?)',
        [userId, department, teacher_code],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.status(201).json({ message: 'Teacher registered successfully' });
        }
      );
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(401).json({ message: 'Invalid credentials' });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken(user);

      res.json({
        message: 'Login successful',
        token,
        role: user.role
      });
    }
  );
};
