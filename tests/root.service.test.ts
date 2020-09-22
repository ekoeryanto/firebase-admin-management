import fastify from "fastify";
import app from "../src/app";

const api = fastify();

beforeAll(async () => {
  await api.register(app);
});

afterAll(() => {
  api.close();
});

describe("GET /", () => {
  it("succeed to get root response", async () => {
    const root = await api.inject({
      url: "/"
    });

    expect(JSON.parse(root.payload)).toMatchObject({
      root: true
    });
  });
});
