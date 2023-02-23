const request = require("supertest");
const app = require("../server");
const User = require("../models/User.model");
const mysql = require("mysql");
const connection = require("../database/connect");
const { expect } = require("chai");
const pool = mysql.createPool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

describe("POST /register", () => {
  afterAll((done) => {
    app.close();
    pool.end();
    connection.end();
    done();
  });
  test("successfully registers user", async () => {
    const newUser = {
      username: "testuser",
      email: "testuser@test.com",
      password: "testpasswWord",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const response = await request(app).post("/register").send(newUser);
    //expect(response.statusCode).toBe(201);
    User.findById(response._body.id, (err, user) => {
      expect(user).to.eventually.toBeTruthy();
    });
  });
});

// describe("POST /register", () => {
//   afterAll((done) => {
//     app.close();
//     pool.end();
//     connection.end();
//     done();
//   });

//   test("Duplicate username or email", async () => {
//     const res = await request(app).post("/register").send({
//       username: "testuser",
//       email: "testuser@example.com",
//       password: "testpassword",
//       address: "456 Main St",
//       city: "Testville",
//     });
//     expect(res.statusCode).toBe(409);
//     expect(res.body.error).toBe("Username or email already taken");
//     expect(res.body.takenFields).toEqual(expect.any(Object));

//     const userId = res.body.id;
//     const deleteSql = `DELETE FROM user WHERE id = ${userId}`;

//     pool.query(deleteSql);
//   });
// });
