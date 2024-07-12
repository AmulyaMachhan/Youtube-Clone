import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  generateAccessTokenFromRefreshToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(generateAccessTokenFromRefreshToken);

router.route("/change-current-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").post(verifyJWT, getCurrentUser);

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);

router
  .route("/update-user-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-user-cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

export default router;
