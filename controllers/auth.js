const { connection } = require("../util/DBconnection/index");

let user_session;
const login = (req, res) => {
  try {
    if (req.body) {
      const { username, password } = req.body;
      if (!username || !password)
        return res.json({ error: "field cannot be empty" });

      const sql = `SELECT id, username FROM admin WHERE username = "${username}" AND password = "${password}"`;
      connection.query(sql, (err, response) => {
        if (err) return res.json(err);
        if (response.length < 1) return res.json({ error: "user not found" });
        // Create Session
        user_session = req.session.admin = {
          user_id: response[0].id,
          username: response[0].username,
        };
        res.json({ success: true });
      });
    }
  } catch (error) {
    res.json.log({ error: "server error" });
  }
};

const session = (req, res) => {
  user_session
    ? res.json({ success: user_session })
    : res.json({ error: "user not found" });
};

module.exports = { login, session };
