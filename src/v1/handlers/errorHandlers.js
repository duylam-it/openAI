export function catchErrors(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function mongoseErrors(err, req, res, next) {
  if (!err.errors) return next(err);
  const errorKeys = Object.keys(err.errors);
  let message = "";
  errorKeys.forEach((key) => (message += err.errors[key].message + ", "));

  message = message.substr(0, message.length - 2);

  res.json({
    status: err.status || 400,
    success: false,
    message,
  });
}

// eslint-disable-next-line no-unused-vars
export function developmentErrors(err, req, res, next) {
  err.stack = err.stack || "";

  res.json({
    status: err.status || 500,
    success: false,
    message: err.message,
    stack: err.stack,
  });
}

// eslint-disable-next-line no-unused-vars
export function productionErrors(err, req, res, next) {
  res.json({
    success: false,
    message: "Internal Server Error",
  });
}

export function notFound(req, res, next) {
  const err = new Error("404 Not Found");
  err.status = 404;
  next(err);
}
