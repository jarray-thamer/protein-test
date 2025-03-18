const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.subscribeButton = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check for existing client (guest or registered)
    let client = await Client.findOne({ email });

    if (client) {
      // Update existing client's subscriber status
      client.subscriber = true;
      await client.save();
    } else {
      // Create new guest client with subscription
      client = new Client({
        email,
        isGuest: true,
        subscriber: true,
      });
      await client.save();
    }

    // Remove sensitive fields from response
    const clientResponse = client.toObject();
    delete clientResponse.password;

    res.status(200).json({
      success: true,
      data: clientResponse,
      message: "Subscription updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing subscription",
      error: error.message,
    });
  }
};

// Create guest client during checkout
exports.createGuestClient = async (req, res) => {
  try {
    const { name, email, phone1, phone2, ville, address } = req.body;

    // Check if email already exists as a registered user
    const existingClient = await Client.findOne({ email, isGuest: false });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login to continue.",
      });
    }

    // Check for existing guest with same email and update if found
    const existingGuest = await Client.findOne({ email, isGuest: true });
    if (existingGuest) {
      const updatedGuest = await Client.findByIdAndUpdate(
        existingGuest._id,
        { name, phone1, phone2, ville, address },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: updatedGuest,
      });
    }

    // Create new guest client
    const guestClient = new Client({
      name,
      email,
      phone1,
      phone2,
      ville,
      address,
      isGuest: true,
    });

    const savedGuestClient = await guestClient.save();

    res.status(201).json({
      success: true,
      data: savedGuestClient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating guest client",
      error: error.message,
    });
  }
};

// Convert guest to registered client
exports.convertGuestToClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find guest account
    const guestClient = await Client.findOne({ email, isGuest: true });
    if (!guestClient) {
      return res.status(404).json({
        success: false,
        message: "Guest account not found",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update guest to registered client
    guestClient.password = hashedPassword;
    guestClient.isGuest = false;
    await guestClient.save();

    // Generate JWT token
    const token = jwt.sign({ id: guestClient._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Remove password from response
    const clientResponse = guestClient.toObject();
    delete clientResponse.password;

    res.status(200).json({
      success: true,
      data: clientResponse,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error converting guest to registered client",
      error: error.message,
    });
  }
};

// Register new client
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if client already exists (either guest or registered)
    const existingClient = await Client.findOne({ email });
    if (existingClient && !existingClient.isGuest) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingClient && existingClient.isGuest) {
      // Convert existing guest to registered user
      existingClient.password = hashedPassword;
      existingClient.isGuest = false;

      const savedClient = await existingClient.save();

      const token = jwt.sign({ id: savedClient._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      const clientResponse = savedClient.toObject();
      delete clientResponse.password;

      return res.status(200).json({
        success: true,
        data: clientResponse,
        token,
      });
    }

    // Create new client
    const client = new Client({
      email,
      password: hashedPassword,
      isGuest: false,
    });

    const savedClient = await client.save();

    // Generate JWT token
    const token = jwt.sign({ id: savedClient._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Remove password from response
    const clientResponse = savedClient.toObject();
    delete clientResponse.password;

    res.status(201).json({
      success: true,
      data: clientResponse,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering client",
      error: error.message,
    });
  }
};

// Login client
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if client exists
    const client = await Client.findOne({ email }).select("+password");
    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Remove password from response
    const clientResponse = client.toObject();
    delete clientResponse.password;

    res.status(200).json({
      success: true,
      data: clientResponse,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Get client profile
exports.getProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.client.id)
      .populate("ordersId")
      .populate("cart.productId")
      .populate("wishlist");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// Update client profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const client = await Client.findByIdAndUpdate(
      req.client.id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const client = await Client.findById(req.client.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Check if product already in cart
    const cartItemIndex = client.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Update quantity if product exists
      client.cart[cartItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      client.cart.push({ productId, quantity });
    }

    await client.save();

    // Return populated cart
    const populatedClient = await Client.findById(req.client.id).populate(
      "cart.productId"
    );

    res.status(200).json({
      success: true,
      data: populatedClient.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const client = await Client.findById(req.client.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const cartItem = client.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cartItem.quantity = quantity;
    await client.save();

    // Return populated cart
    const populatedClient = await Client.findById(req.client.id).populate(
      "cart.productId"
    );

    res.status(200).json({
      success: true,
      data: populatedClient.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart item",
      error: error.message,
    });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const client = await Client.findById(req.client.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    client.cart = client.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await client.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const client = await Client.findById(req.client.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (!client.wishlist.includes(productId)) {
      client.wishlist.push(productId);
      await client.save();
    }

    // Return populated wishlist
    const populatedClient = await Client.findById(req.client.id).populate(
      "wishlist"
    );

    res.status(200).json({
      success: true,
      data: populatedClient.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error.message,
    });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const client = await Client.findById(req.client.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    client.wishlist = client.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await client.save();

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
      error: error.message,
    });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();

    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clients",
      error: error.message,
    });
  }
};

// Admin: Create client
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone1, phone2, ville, address } = req.body;

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists",
      });
    }

    const newClient = new Client({
      name,
      email,
      phone1,
      phone2,
      ville,
      address,
    });

    const savedClient = await newClient.save();
    res.status(201).json({ success: true, data: savedClient });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating client",
      error: error.message,
    });
  }
};

// Admin: Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.email) {
      const existingClient = await Client.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another client",
        });
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedClient) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, data: updatedClient });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating client",
      error: error.message,
    });
  }
};

// Admin: Get single client
exports.getClientById = async (req, res) => {
  try {
    // Extract client ID from request parameters
    const clientId = req.params.id;

    // Fetch client by ID, excluding password and populating references
    const client = await Client.findById(clientId)
      .select("-password") // Exclude sensitive password field
      .populate("ordersId") // Populate orders (references "Vente")
      .populate("cart.productId") // Populate products in cart (references "Product")
      .populate("wishlist"); // Populate wishlist (references "Product")

    // Check if client exists
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Return client data
    res.status(200).json(client);
  } catch (error) {
    // Handle errors (e.g., invalid ID format, database issues)
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting client",
      error: error.message,
    });
  }
};

exports.deleteManyClients = async (req, res) => {
  try {
    const clientsIds = req.body;

    if (!Array.isArray(clientsIds) || clientsIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty clients array",
      });
    }

    const deleteResult = await Client.deleteMany({
      _id: { $in: clientsIds },
    });

    res.status(200).json({
      success: true,
      message: `clients deleted successfully`,
      date: { deleteResult: deleteResult.deletedCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting clients",
      error: error.message,
    });
  }
};

const https = require("https");
const querystring = require("querystring");
exports.sendSMS = async (req, res) => {
  const { clientsPhone, message } = req.body;
  console.log(req.body.clientsPhone.join(","));

  try {
    const smsData = querystring.stringify({
      action: "send-sms",
      api_key: process.env.WINSMS_API_KEY,
      to: clientsPhone.join(","),
      sms: message,
      from: "SOBITAS",
    });

    const options = {
      hostname: "www.winsmspro.com",
      port: 443,
      path: "/sms/sms/api?" + smsData,
      method: "GET",
    };
    const req = https.request(options, (res) => {
      console.log("status code", res.statusCode);
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });
    req.on("error", (e) => {
      console.error(e);
    });
    req.write(smsData);
    req.end();
    return res.status(200).json({
      success: true,
      message: "SMS has been sent to:" + clientsPhone.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending SMS",
      error: error.message,
    });
  }
};

const nodemailer = require("nodemailer");
const handlebar = require("handlebars");

exports.sendEmail = async (req, res) => {
  const { clientsEmail, subject, message } = req.body;

  const recipients = Array.isArray(clientsEmail)
    ? clientsEmail
    : [clientsEmail];
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST.toString(),
    port: parseInt(process.env.SMTP_PORT.toString()), // Convert to number
    secure: false, // or process.env.SMTP_SECURE === 'true' if using env var
    auth: {
      user: process.env.SMTP_USER.toString(),
      pass: process.env.SMTP_PASS.toString(),
    },
  });

  try {
    const testResult = await transport.verify();
  } catch (error) {
    console.error("Failed to verify email service:", error);
  }

  const senderName = "Proteine Tunisie"; // Replace with your desired name
  const senderEmail = "contact@protein.tn"; // Replace with your desired email
  try {
    const sendPromises = recipients.map((email) =>
      transport.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject,
        html: message,
      })
    );
    await Promise.all(sendPromises);
    return res.status(200).json({
      success: true,
      message: `Email has been sent to ${recipients.length} recipient(s)`,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending email",
    });
  }
};
