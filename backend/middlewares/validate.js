export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce((acc, issue) => {
      const field = issue.path[0] || "unknown";
      acc[field] = issue.message;
      return acc;
    }, {});

    // Grab the first error message
    const firstErrorMessage = result.error.issues[0].message;

    return res.status(400).json({
      success: false,
      message: firstErrorMessage,
      data: errors,
    });
  }

  req.body = result.data;
  next();
};
