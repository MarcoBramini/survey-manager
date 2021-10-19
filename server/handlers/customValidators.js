exports.checkAllowedBodyFields = (allowedBodyFields) => {
  return (body) => {
    Object.keys(body).forEach((key) => {
      if (!allowedBodyFields.includes(key))
        throw new Error("field '" + key + "' not allowed");
    });
    return true;
  };
};

exports.checkAllowedParamValues = (allowedParamValues) => {
  return (value) => {
    if (!allowedParamValues.includes(value))
      throw new Error("Param value '" + value + "' not allowed");
    return true;
  };
};
