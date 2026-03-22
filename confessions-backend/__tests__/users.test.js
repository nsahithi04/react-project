const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

jest.mock("../models/User");

describe("User Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  // ── POST /users ───────────────────────────────────────────────────────────

  describe("POST /users", () => {
    it("creates a new user if uid does not exist", async () => {
      const fakeUser = { uid: "uid1", name: "alice", email: "alice@test.com" };

      User.findOne.mockResolvedValue(null); // no existing user
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(fakeUser),
      }));

      const res = await request(app)
        .post("/users")
        .send({ uid: "uid1", name: "Alice", email: "alice@test.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User created");
    });

    it("returns existing user if uid already exists", async () => {
      const existingUser = {
        uid: "uid1",
        name: "alice",
        email: "alice@test.com",
      };
      User.findOne.mockResolvedValue(existingUser);

      const res = await request(app)
        .post("/users")
        .send({ uid: "uid1", name: "Alice", email: "alice@test.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User already exists");
    });

    it("returns 500 on database error", async () => {
      User.findOne.mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .post("/users")
        .send({ uid: "uid1", name: "Alice", email: "alice@test.com" });

      expect(res.status).toBe(500);
    });
  });

  // ── GET /users/:uid ───────────────────────────────────────────────────────

  describe("GET /users/:uid", () => {
    it("returns user when found", async () => {
      User.findOne.mockResolvedValue({
        uid: "uid1",
        name: "alice",
        email: "alice@test.com",
      });

      const res = await request(app).get("/users/uid1");

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("alice");
    });

    it("returns 404 when user not found", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app).get("/users/nonexistent");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("returns 500 on database error", async () => {
      User.findOne.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/users/uid1");

      expect(res.status).toBe(500);
    });
  });

  // ── PUT /users/update-name ────────────────────────────────────────────────

  describe("PUT /users/update-name", () => {
    it("updates and returns the user", async () => {
      User.findOneAndUpdate.mockResolvedValue({
        uid: "uid1",
        name: "alice updated",
        email: "alice@test.com",
      });

      const res = await request(app)
        .put("/users/update-name")
        .send({ uid: "uid1", name: "Alice Updated" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Name updated");
      expect(res.body.data.name).toBe("alice updated");
    });

    it("returns 404 if user not found", async () => {
      User.findOneAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put("/users/update-name")
        .send({ uid: "nonexistent", name: "Bob" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("returns 500 on database error", async () => {
      User.findOneAndUpdate.mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .put("/users/update-name")
        .send({ uid: "uid1", name: "Alice" });

      expect(res.status).toBe(500);
    });
  });

  // ── GET /users ────────────────────────────────────────────────────────────

  describe("GET /users", () => {
    it("returns all users", async () => {
      User.find.mockResolvedValue([
        { uid: "uid1", name: "alice", email: "alice@test.com" },
        { uid: "uid2", name: "bob", email: "bob@test.com" },
      ]);

      const res = await request(app).get("/users");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("returns 500 on database error", async () => {
      User.find.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/users");

      expect(res.status).toBe(500);
    });
  });
});
