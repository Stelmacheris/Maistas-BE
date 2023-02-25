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

describe("Edit Profile Router", () => {
  let userId;
  let authToken;

  beforeAll(async () => {
    const user = {
      username: "testuser",
      email: "testuser2@test.com",
      password: "weak",
      address: "123 Main St",
      city: "Anytown",
      created_at: new Date(),
    };
    const response = await request(app).post("/register").send(user);
    userId = response.body.id;
    const loginResponse = await request(app).post("/login").send({
      email: user.email,
      password: user.password,
    });
    authToken = loginResponse.body.token;
  });

  afterAll((done) => {
    User.delete(userId, (err, result) => {
      if (err) throw err;
      app.close();
      pool.end();
      connection.end();
      done();
    });
  });

  test("successfully updates user profile with valid data", async () => {
    const updatedProfileData = {
      username: "newusername",
      address: "456 Main St",
      city: "Newtown",
    };
    const response = await request(app)
      .put("/edit-profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedProfileData);
    expect(response.statusCode).toBe(200);
  });

  test("fails to update user profile with invalid data", async () => {
    const updatedProfileData = {
      email: "newemail@test.com",
      passwyord: "newpassword",
    };
    const response = await request(app)
      .put("/edit-profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedProfileData);
    expect(response.statusCode).toBe(400);
  });
});
