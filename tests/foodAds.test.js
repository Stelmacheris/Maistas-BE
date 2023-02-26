const request = require("supertest");
const app = require("../server");
const FoodAd = require("../models/FoodAd.model");
const Image = require("../models/image.model");
const mysql = require("mysql");
const connection = require("../database/connect");

const pool = mysql.createPool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

describe("POST /food-ad", () => {
  let foodAdIds = [];

  afterAll((done) => {
    foodAdIds.map((id) => {
      FoodAd.delete(id, (err, result) => {
        if (err) throw err;
      });
    });
    app.close();
    pool.end();
    connection.end();
    done();
  });

  test("successfully creates new food ad", async () => {
    const newFoodAd = {
      title: "Test Food Ad Paulius",
      description: "This is a test food ad",
      expiration_date: "2023-03-31",
      food_type: "Seafood",
      user_id: 232,
    };
    const response = await request(app)
      .post("/food-ad")
      .send({ body: JSON.stringify(newFoodAd) })
      .set(
        "authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwLCJ0eXBlIjoidXNlciIsImlhdCI6MTY3NzQxOTEwOSwiZXhwIjoxNjc3NTA1NTA5fQ.theZIm8Ny82qdIz7yCQ0-TOcn1M9RlHuBMwQa2PkxyM`
      );
    expect(response.statusCode).toBe(201);
    foodAdIds.push(response.body.id);
  });

  test("returns error if required field is missing", async () => {
    const newFoodAd = {
      title: "Test Food Ad Paulius",
      description: "This is a test food ad",
      expiration_date: "2023-03-31",
      user_id: 232,
    };
    const response = await request(app)
      .post("/food-ad")
      .send({ body: JSON.stringify(newFoodAd) })
      .set(
        "authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwLCJ0eXBlIjoidXNlciIsImlhdCI6MTY3NzQxOTEwOSwiZXhwIjoxNjc3NTA1NTA5fQ.theZIm8Ny82qdIz7yCQ0-TOcn1M9RlHuBMwQa2PkxyM`
      );
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /food-ads", () => {
  const authToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwLCJ0eXBlIjoidXNlciIsImlhdCI6MTY3NzQxOTEwOSwiZXhwIjoxNjc3NTA1NTA5fQ.theZIm8Ny82qdIz7yCQ0-TOcn1M9RlHuBMwQa2PkxyM";

  test("returns list of food ads filtered by food types and user ID", async () => {
    const foodTypes = ["Snacks", "Meat"];
    const userId = 232;

    const response = await request(app)
      .get("/food-ads")
      .set("authorization", authToken)
      .send({ body: { foodTypes: foodTypes, userId: userId } });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);

    const foodAd = response.body[0];
    expect(foodAd.title).toBe("Test Food Ad");
    expect(foodAd.description).toBe("This is a test food ad");
    expect(foodAd.expiration_date).toBe("2023-03-31");
    expect(foodAd.food_type).toBe("Meat");
    expect(foodAd.user_id).toBe(userId);
  });
});

describe("GET /food-ad", () => {
  let foodAdIds = [];

  beforeAll((done) => {
    const foodAd1 = {
      title: "Test Food Ad 1",
      description: "This is a test food ad 1",
      expiration_date: "2023-03-31",
      food_type: "Seafood",
      user_id: 232,
    };
    const foodAd2 = {
      title: "Test Food Ad 2",
      description: "This is a test food ad 2",
      expiration_date: "2023-03-31",
      food_type: "Snacks",
      user_id: 232,
    };
    const foodAd3 = {
      title: "Test Food Ad 3",
      description: "This is a test food ad 3",
      expiration_date: "2023-03-31",
      food_type: "Meat",
      user_id: 232,
    };

    FoodAd.create(foodAd1, (err, result) => {
      if (err) throw err;
      foodAdIds.push(result.insertId);
    });
    FoodAd.create(foodAd2, (err, result) => {
      if (err) throw err;
      foodAdIds.push(result.insertId);
    });
    FoodAd.create(foodAd3, (err, result) => {
      if (err) throw err;
      foodAdIds.push(result.insertId);
    });
    done();
  });

  afterAll((done) => {
    foodAdIds.map((id) => {
      FoodAd.delete(id, (err, result) => {
        if (err) throw err;
      });
    });
    app.close();
    pool.end();
    connection.end();
    done();
  });

  test("returns all food ads if no food type filter provided", async () => {
    const response = await request(app)
      .get("/food-ad")
      .set(
        "authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwLCJ0eXBlIjoidXNlciIsImlhdCI6MTY3NzQxOTEwOSwiZXhwIjoxNjc3NTA1NTA5fQ.theZIm8Ny82qdIz7yCQ0-TOcn1M9RlHuBMwQa2PkxyM`
      );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
  });
});

describe("DELETE /image/:foodAdId/:id", () => {
  let foodAdId;
  let imageId;

  beforeAll((done) => {
    const foodAd = {
      title: "Test Food Ad",
      description: "This is a test food ad",
      expiration_date: "2023-03-31",
      food_type: "Meat",
      user_id: 232,
    };

    FoodAd.create(foodAd, (err, result) => {
      if (err) throw err;
      foodAdId = result.insertId;

      const image = {
        filename: "test.jpg",
        mimetype: "image/jpeg",
        size: 1024,
        created_at: new Date(),
        food_ad_id: foodAdId,
      };

      Image.create(image, (err, result) => {
        if (err) throw err;
        imageId = result.insertId;
        done();
      });
    });
  });

  afterAll((done) => {
    Image.deleteById(imageId, (err, result) => {
      if (err) throw err;

      FoodAd.delete(foodAdId, (err, result) => {
        if (err) throw err;

        app.close();
        pool.end();
        connection.end();
        done();
      });
    });
  });

  test("deletes image for a food ad", async () => {
    const response = await request(app)
      .delete(`/image/${foodAdId}/${imageId}`)
      .set("authorization", authToken);

    expect(response.statusCode).toBe(204);

    const checkImage = await Image.getById(imageId);
    expect(checkImage).toBeNull();
  });

  test("returns error if image is not found for a food ad", async () => {
    const fakeImageId = 1234;

    const response = await request(app)
      .delete(`/image/${foodAdId}/${fakeImageId}`)
      .set("authorization", authToken);

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Image not found.");
  });
});
