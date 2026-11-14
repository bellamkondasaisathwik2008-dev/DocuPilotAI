export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          error: 'Validation failed on request body.',
          details: errorMessages
        });
      }

      req.validatedBody = parsed.data;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body format.',
        details: err.message
      });
    }
  };
};
