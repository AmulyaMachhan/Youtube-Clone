import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);

    if (!user) {
      throw new ApiError(
        500,
        "User invalid during refresh and access token generation"
      );
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Failed during generation of access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Steps to register a user
  // 1. Extract neccessary fields from request body
  // 2. Validate the fields
  // 3. Check is the user is already in the database i.e. is already registerUser
  // 4. Check for avatar and coverImage in the Server
  // 5. Upload avatar and coverImage on cloudinary and remove them from the Server
  // 6. create a user model for the database
  // 7. Return the response and remove the password and refreshToken field from the response

  const { username, email, fullName, password } = req.body;

  if (
    [username, email, fullName, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are important");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already Exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Steps to login a user
  // 1. Extract user data from request.
  // 2. Validate username and email.
  // 3. Find user with that username and email and throw error if user does not exist.
  // 4. Check if password is correct.
  // 5. Generate access and refresh tokens.
  // 6. Return a response and send cookies.
  const { email, username, password } = req.body;

  console.log(username);

  if (email === "" || username === "") {
    throw new ApiError(409, "Username or Email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password Incorrect");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const generateAccessTokenFromRefreshToken = asyncHandler(async (req, res) => {
  // Steps to generate access token from refresh token-
  // 1. Access refresh token from req cookies or body.
  // 2. Validate refresh Token.
  // 3. Decode this refresh token from jwt verification.
  // 4. Validate the decoded token.
  // 5. Find user based on this token.
  // 6. Validate the user.
  // 7. Check whether the stored refresh token and the incoming the refresh token are the same.
  // 8. Generate the new refresh and access tokens using the previously build function.
  // 9. Return a response and set the cookies and its options for the new refresh and access token.

  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const { newRefreshToken, newAccessToken } = generateAccessAndRefreshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "New Access Token Generated Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // Steps to change password
  // 1. Extract old , new and confirm password details from request body
  // 2. Check whether new and confirm password are the same.
  // 3. Extract and find user from req.users which was injected during the middleware.
  // 4. Check whether the old password is the same as the password stored inside the database using the method isPasswordCorrect.
  // 5. Update and save the new password in the user model.
  // 6. Generate the response

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New and confirm password do not match");
  }

  const user = await User.findById(req.users?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Unauthorized Access");
  }

  user.password = newPassword;
  await user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // Steps to get the current user detail-
  // Return the response and embed req.user data from the middleware injected

  return res
    .status(200)
    .json(new ApiResponse(200, req.users, "User fetched Successfully"));
});
