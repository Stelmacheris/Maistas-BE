const request = require("supertest");
const app = require("../server");
const User = require("../models/User.model");
const mysql = require("mysql");
const connection = require("../database/connect");
const bcrypt = require("bcryptjs");
const pool = mysql.createPool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

describe("POST /register", () => {
  let userId;
  afterAll((done) => {
    User.delete(userId, (err, result) => {
      if (err) throw err;
      app.close();
      pool.end();
      connection.end();
      done();
    });
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
    expect(response.statusCode).toBe(201);
    userId = response.body.id;
    User.findById(response.body.id, (err, user) => {
      expect(user).toBeTruthy();
    });
  });

  test("returns error for invalid email address", async () => {
    const newUser = {
      username: "testuser",
      email: "invalidemail",
      password: "testpasswWord",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const response = await request(app).post("/register").send(newUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.mesage).toBe("Invalid email");
  });

  test("returns error for missing required fields", async () => {
    const newUser = {
      username: "testuser",
      password: "testpasswWord",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const response = await request(app).post("/register").send(newUser);
    expect(response.statusCode).toBe(500);
  });

  test("returns error for weak password", async () => {
    const newUser = {
      username: "testuser",
      email: "testuser2@test.com",
      password: "weak",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const response = await request(app).post("/register").send(newUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter."
    );
  });
});
