exports.success = (res, status, data, message) => {
  return res.status(status).send({
    error: false,
    status,
    message,
    data,
  });
};

exports.error = (res, status, data, message) => {
  return res.status(status).send({
    error: true,
    status,
    message,
    data,
  });
};
