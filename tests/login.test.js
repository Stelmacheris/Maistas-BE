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

describe("POST /login", () => {
  let userIds = [];
  afterAll((done) => {
    userIds.map((id) => {
      User.delete(id, (err, result) => {
        if (err) throw err;
      });
    });
    app.close();
    pool.end();
    connection.end();
    done();
  });

  test("successfully logs in user with correct credentials", async () => {
    const credentials = {
      email: "testuser@test.com",
      password: "testpasswWord",
    };
    const newUser = {
      username: "testuser",
      email: "testuser@test.com",
      password: "testpasswWord",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const _response = await request(app).post("/register").send(newUser);
    const response = await request(app).post("/login").send(credentials);
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
    userIds.push(_response.body.id);
  });

  test("returns error for missing email field", async () => {
    const credentials = {
      password: "testpasswWord",
    };
    const newUser = {
      username: "testuser",
      email: "testuser@test.com",
      password: "testpasswWord",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const _response = await request(app).post("/register").send(newUser);
    const response = await request(app).post("/login").send(credentials);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email field is required");
    userIds.push(_response.body.id);
  });

  test("returns error for missing password field", async () => {
    const credentials = {
      email: "testuser@test.com",
    };
    const newUser = {
      username: "testuser",
      email: "testuser@test.com",
      password: "testpasswWord",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const _response = await request(app).post("/register").send(newUser);
    const response = await request(app).post("/login").send(credentials);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Password field is required");
    userIds.push(_response.body.id);
  });

  test("returns error for invalid email", async () => {
    const credentials = {
      email: "invalidemail@test.com",
      password: "testpasswWord",
    };
    const newUser = {
      username: "testuser",
      email: "testuser@test.com",
      password: "testpasswWord",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const _response = await request(app).post("/register").send(newUser);
    const response = await request(app).post("/login").send(credentials);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
    userIds.push(_response.body.id);
  });

  test("returns error for invalid password", async () => {
    const credentials = {
      email: "testuser@test.com",
      password: "invalidpassword",
    };
    const newUser = {
      username: "testuser",
      email: "testuser@test.com",
      password: "testpasswWord",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const _response = await request(app).post("/register").send(newUser);
    const response = await request(app).post("/login").send(credentials);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
    userIds.push(_response.body.id);
  });
});
