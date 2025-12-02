import { defaultAIModel } from "./config";

describe("defaultAIModel", () => {
  it("falls back to raptor-mini-preview when env var is unset", () => {
    const expected = process.env.REACT_APP_DEFAULT_AI_MODEL || "raptor-mini-preview";
    expect(defaultAIModel).toBe(expected);
  });
});
