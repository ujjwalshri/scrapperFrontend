import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  res.status(200).send(new ApiResponse(200, "OK"));
});

export { healthcheck };
