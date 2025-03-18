const { compare, hash } = require("bcryptjs");
const AdminUser = require("../models/AdminUser");
const { createToken } = require("../utils/tokenManager");
const Client = require("../models/Client");

// this function is used to verify the user and check if the user is an admin or not before allowing access to the admin panel
const verifyAdminUser = async (req, res, next) => {
  try {
    const { _id } = res.locals.jwtData;

    const user = await AdminUser.findById(_id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    if (user._id.toString() !== res.locals.jwtData._id) {
      return res.status(401).json({ message: "Token not valid" });
    }
    return res.status(200).json({
      message: "Token is valid",
      user,
    });
  } catch (error) {
    console.log("❌ Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error.message });
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const adminUser = await AdminUser.findOne({ userName: username });

    if (!adminUser) {
      return res.status(401).json({ message: "User not registered" });
    }
    const isPasswordCorrect = await compare(password, adminUser.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = createToken(adminUser._id.toString(), adminUser.role, "30d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    return res.status(200).json({
      message: "Logged in successfully",
      adminUsername: adminUser.userName,
      adminRole: adminUser.role,
      token,
    });
  } catch (error) {
    console.log("❌ Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error.message });
  }
};

const adminLogout = async (req, res, next) => {
  try {
    const { _id } = res.locals.jwtData; // Changed from req.locals to res.locals and id to _id

    const user = await AdminUser.findById(_id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    if (user._id.toString() !== _id) {
      // Changed from req.locals.jwtData.id
      return res.status(401).json({ message: "Token not valid" });
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("❌ Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error.message });
  }
};
// <============== CLIENTS AUTH =================>
const verifyClient = async (req, res) => {
  try {
    const { _id } = res.locals.jwtData;
    console.log(_id);

    const client = await Client.findById(_id);
    if (!client) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }
    if (client._id.toString() !== res.locals.jwtData._id) {
      return res.status(401).json({ message: "Token not valid" });
    }
    return res.status(200).json({ message: "Token is valid", user: client });
  } catch (error) {
    console.log("❌ Error", error);
    return res.status(500).json({
      message: "Internal Server Error Check Client Auth",
      cause: error.message,
    });
  }
};

const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(401).json({ message: "User not registered" });
    }

    const isPasswordCorrect = await compare(password, client.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = createToken(client._id.toString(), "client", "30d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    // Remove password from client object before sending
    const clientObj = client.toObject();
    delete clientObj.password;

    return res.status(200).json({
      status: "ok",
      message: "Logged in successfully",
      user: clientObj,
      token,
    });
  } catch (error) {
    console.log("❌ Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error.message });
  }
};

// Client registration function - updated to handle guest to registered user conversion
const clientRegister = async (req, res) => {
  try {
    const { name, email, password, phone1, ville, address } = req.body;

    // Check if user already exists
    const existingClient = await Client.findOne({ email });

    if (existingClient) {
      // If user exists but is a guest, convert them to a registered user
      if (existingClient.isGuest) {
        // Update the guest user with registration info
        existingClient.name = name;
        existingClient.password = await hash(password, 10);
        existingClient.phone1 = phone1;
        existingClient.ville = ville;
        existingClient.address = address;
        existingClient.isGuest = false;

        await existingClient.save();

        // Create and set token
        const token = createToken(
          existingClient._id.toString(),
          "client",
          "30d"
        );
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);

        // Remove password from client object before sending
        const clientObj = existingClient.toObject();
        delete clientObj.password;

        return res.status(200).json({
          status: "ok",
          message:
            "Registered successfully. Previous guest orders have been linked to your account.",
          user: clientObj,
          token,
        });
      } else {
        // If user exists and is not a guest, return error
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // If no existing user, create new client
    const hashedPassword = await hash(password, 10);

    const newClient = new Client({
      name,
      email,
      password: hashedPassword,
      phone1,
      ville,
      address,
      isGuest: false,
    });

    await newClient.save();

    // Create and set token
    const token = createToken(newClient._id.toString(), "client", "30d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    // Remove password from client object before sending
    const clientObj = newClient.toObject();
    delete clientObj.password;

    return res.status(201).json({
      status: "ok",
      message: "Registered successfully",
      user: clientObj,
      token,
    });
  } catch (error) {
    console.log("❌ Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error.message });
  }
};

// Fix the client logout function
const clientLogout = async (req, res) => {
  try {
    const { _id } = res.locals.jwtData; // Fixed from req.locals to res.locals
    const user = await Client.findById(_id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    if (user._id.toString() !== _id) {
      // Fixed from req.locals.jwtData.id
      return res.status(401).json({ message: "Token not valid" });
    }

    return res
      .status(200)
      .json({ status: "ok", message: "Logged out successfully" });
  } catch (error) {
    console.log("❌ Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error.message });
  }
};

module.exports = {
  verifyAdminUser,
  adminLogout,
  adminLogin,
  verifyClient,
  clientLogout,
  clientLogin,
  clientRegister,
};
