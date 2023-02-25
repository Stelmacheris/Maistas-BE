const jwt = require("jsonwebtoken");
const verify = require("../verify/verify");
require("dotenv").config();
describe("verify middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });
  it("should send 401 status when invalid token is provided", () => {
    req.headers.authorization = "Bearer invalidtoken";

    verify(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it("should send 401 status when token is not present", () => {
    verify(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });
});
