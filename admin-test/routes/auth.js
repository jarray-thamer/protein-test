const { Router } = require("express");
const { verifyToken, clientVerifyToken } = require("../utils/tokenManager");
const {
  verifyAdminUser,
  adminLogin,
  adminLogout,
  verifyClient,
  clientLogout,
  clientLogin,
  clientRegister,
} = require("../controllers/auth");
const validate = require("../validator/validation");
const {
  adminLoginSchema,
  clientLoginSchema,
  clientRegisterSchema,
} = require("../validator/admin");

const adminAuthRoutes = Router();

// Admin auth routes
adminAuthRoutes.get(
  "/admin/check-auth-status/:token",
  verifyToken,
  verifyAdminUser
);
adminAuthRoutes.post("/admin/login", validate(adminLoginSchema), adminLogin);
adminAuthRoutes.get("/admin/logout/:token", verifyToken, adminLogout);

// Store auth routes
adminAuthRoutes.get(
  "/store/check-auth-status/:token",
  clientVerifyToken,
  verifyClient
);
adminAuthRoutes.get("/store/logout/:token", clientVerifyToken, clientLogout);
adminAuthRoutes.post("/store/login", validate(clientLoginSchema), clientLogin);
adminAuthRoutes.post("/store/register", clientRegister);

module.exports = adminAuthRoutes;
