const successResponse = (req, res, data, code = 200, message) => {
  res.status(code).send({
    code,
    data,
    success: true,
    message,
  });
};
const errorResponse = (
  req,
  res,
  code = 500,
  errorMessage = "Something went wrong"
) => {
  res.status(code).json({
    code,
    errorMessage,
    success: false,
  });
};
module.exports = { successResponse, errorResponse };
