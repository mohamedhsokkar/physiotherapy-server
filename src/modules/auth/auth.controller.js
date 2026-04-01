import { registerUser, loginUser, getCurrentUser } from "./auth.service.js";

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role
        },
        token: result.token
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role
        },
        token: result.token
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.userId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export { register, login, me };
