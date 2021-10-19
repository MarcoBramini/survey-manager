const { UserRole } = require("../models/user");

// Checks if a given request is coming from an authenticated admin
exports.checkAdminUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === UserRole.ADMIN) return next();

  return res
    .status(401)
    .json({ error: "not authenticated or insufficient privileges" });
};
