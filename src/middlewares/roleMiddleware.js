const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you do not have permission"
      });
    }

    next();
  };
};

export default allowRoles;