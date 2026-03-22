const request = require("supertest");
const app = require("../app");
const Confession = require("../models/Confession");

// mock mongoose model
jest.mock("../models/Confession");

describe("Confession Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  // ── POST /confessions ─────────────────────────────────────────────────────

  describe("POST /confessions", () => {
    it("returns 400 if any field is missing", async () => {
      const res = await request(app)
        .post("/confessions")
        .send({ title: "Hi", description: "test" }); // missing emails

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("All fields are required");
    });

    it("creates and returns confession when all fields provided", async () => {
      const fakeConfession = {
        _id: "abc123",
        title: "Hi",
        description: "test",
        senderEmail: "a@test.com",
        receiverEmail: "b@test.com",
      };

      // mock constructor and save
      Confession.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(fakeConfession),
      }));

      const res = await request(app).post("/confessions").send({
        title: "Hi",
        description: "test",
        senderEmail: "a@test.com",
        receiverEmail: "b@test.com",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Confession sent");
    });

    it("returns 500 on database error", async () => {
      Confession.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error("DB error")),
      }));

      const res = await request(app).post("/confessions").send({
        title: "Hi",
        description: "test",
        senderEmail: "a@test.com",
        receiverEmail: "b@test.com",
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  // ── GET /confessions/:email ───────────────────────────────────────────────

  describe("GET /confessions/:email", () => {
    it("returns confessions for the given email", async () => {
      const fakeData = [
        { title: "Secret", description: "I did it", createdAt: new Date() },
      ];

      Confession.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeData),
      });

      const res = await request(app).get("/confessions/b@test.com");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("Secret");
    });

    it("returns empty array when no confessions found", async () => {
      Confession.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      });

      const res = await request(app).get("/confessions/nobody@test.com");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it("returns 500 on database error", async () => {
      Confession.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      });

      const res = await request(app).get("/confessions/b@test.com");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  // ── GET /sent-confessions/:email ──────────────────────────────────────────

  describe("GET /sent-confessions/:email", () => {
    it("returns sent confessions for the given email", async () => {
      const fakeData = [
        {
          title: "Sorry",
          description: "I broke it",
          receiverEmail: "b@test.com",
          createdAt: new Date(),
        },
      ];

      Confession.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeData),
      });

      const res = await request(app).get("/sent-confessions/a@test.com");

      expect(res.status).toBe(200);
      expect(res.body.data[0].title).toBe("Sorry");
      expect(res.body.data[0].receiverEmail).toBe("b@test.com");
    });

    it("returns 500 on database error", async () => {
      Confession.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      });

      const res = await request(app).get("/sent-confessions/a@test.com");

      expect(res.status).toBe(500);
    });
  });
});
