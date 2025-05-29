export const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    next();
  } catch (err) {
    console.log(err);
    const status = 422;
    const message = "Fill the input properly";
    const extraDetails = err.errors[0].message;

    const error = { status, message, extraDetails };
    // res.status(400).json({ msg: error.issues[0].message });
    //* ↓↓↓By using errorMiddleware we can do it like this↓↓↓:
    next(error);
  }
};
