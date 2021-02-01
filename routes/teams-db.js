var express = require("express");
var router = express.Router();
var mysql = require("mysql");

/**
 * IMPORTANT: add content type headers to be able to use req.body.*
  headers: {"Content-Type": "application/json"},
 */

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "teams"
});

/**
 * run this before first USAGE to create members TABLE
 */
router.get("/install", function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `
    CREATE TABLE IF NOT EXISTS members (id INT NOT NULL AUTO_INCREMENT, functie TEXT NOT NULL, fullName TEXT NOT NULL, telefon TEXT NOT NULL, prezent TEXT NOT NULL, isSafe TEXT NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB;
    `;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      connection.release();
      res.redirect("/");
    });
  });
});

/**
 *
 */
router.get("/", function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `SELECT id, functie, fullName, telefon,  prezent, isSafe FROM members`;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      connection.release();
      res.json(results);
    });
  });
});

/**
 *
 */
router.post("/create", function (req, res, next) {
  const functie = req.body.functie;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const telefon = req.body.telefon;
  const prezent = req.body.prezent;
  const isSafe = req.body.isSafe;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `INSERT INTO members (id, functie, firstName, lastName, telefon, prezent, isSafe) VALUES (NULL, ?, ?, ?);`;
    connection.query(sql, [functie, firstName, lastName, telefon, prezent, isSafe], function (err, results) {
      if (err) throw err;
      const id = results.insertId;
      connection.release();
      res.json({
        success: true,
        id
      });
    });
  });
});

/**
 *
 */
router.delete("/delete", function (req, res, next) {
  const id = req.body.id;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `DELETE FROM members WHERE id=?`;
    connection.query(sql, [id], function (err, results) {
      if (err) throw err;
      connection.release();
      res.json({ success: true });
    });
  });
});

/**
 *
 */
router.put("/update", function (req, res, next) {
  const id = req.body.id;
  const functie = req.body.functie;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const telefon = req.body.telefon;
  const prezent = req.body.prezent;
  const isSafe = req.body.isSafe;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `UPDATE members SET functie=?, firstName=?, lastName=?, telefon=?, prezent=?, isSafe=?,WHERE id=?`;
    connection.query(sql, [functie, firstName, lastName, telefon, prezent, isSafe, id], function (err, results) {
      if (err) throw err;
      connection.release();
      res.json({ success: true });
    });
  });
});

module.exports = router;
