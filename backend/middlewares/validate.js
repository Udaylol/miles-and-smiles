export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce((acc, issue) => {
      const field = issue.path[0];
      acc[field] = issue.message;
      return acc;
    }, {});

    return res.status(400).json({ errors });
  }

  req.body = result.data;
  next();
};
