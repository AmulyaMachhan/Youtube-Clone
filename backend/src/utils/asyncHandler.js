// ASYNCHRONOUS FUNCTION HANDLER USING TRY CATCH BLOCK
const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: true,
      message: error.message,
    });
  }
};
