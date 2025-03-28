const mongoose = require("mongoose");
const Pack = require("../models/pack.js");
const Product = require("../models/Product.js");
const Information = require("../models/information.js");
const Client = require("../models/Client.js");

const Decimal = require("decimal.js");

const generateReference = require("../utils/generateReference.js");
const PromoCode = require("../models/PromoCode.js");
const Vente = require("../models/Ventes.js");

exports.createVente = async (req, res) => {
  try {
    const reference = await generateReference();
    const advancedInfo = await Information.findOne().select("advanced -_id");
    const { items } = req.body;
    let { clientId } = req.body || "";
    const { client } = req.body;
    const { livreur } = req.body;

    if (req.body.isNewClient) {
      const newClient = new Client({
        name: client.name || "",
        email: client.email || "",
        phone1: client.phone1 || "",
        address: client.address || "",
        ville: client.ville || "",
      });
      const savedClient = await newClient.save();
      clientId = savedClient._id; // Assign new client ID
    } else {
      const clientExists = await Client.findById(clientId);
      if (!clientExists) {
        return res.status(400).json({ message: "Client not found" });
      }
    }
    const { promoCode } = req.body || "";

    let promotionCode = null;
    // Validate promo code existence
    if (promoCode) {
      promotionCode = await PromoCode.findOne({ code: promoCode });
      if (!promotionCode) {
        return res.status(400).json({ message: "Promotion code not found" });
      }
    }

    // Initialize values as Decimal.js instances
    let tva = new Decimal(0);
    let totalHT = new Decimal(0);
    let livraisonCost = new Decimal(req.body.livraison || 0);
    let productDiscount = new Decimal(0);
    let packDiscount = new Decimal(0);
    let discount = new Decimal(0);
    let totalTTC = new Decimal(0);
    const taxRate = new Decimal(advancedInfo.advanced.tva || 0.19); // Example 20% VAT

    // Process each product
    for (const item of items) {
      if (item.type === "Product") {
        const product = await Product.findById(item.itemId);

        if (!product) {
          // Don't return here - collect all errors first
          throw new Error(`Product with id ${item.itemId} not found`);
        }

        // Handle decimal conversion safely
        const currentPrice = new Decimal(product.price.toString());
        const oldPrice = product.oldPrice
          ? new Decimal(product.oldPrice.toString())
          : null;

        if (oldPrice) {
          productDiscount = productDiscount.plus(oldPrice.minus(currentPrice));
        }

        const productTotal = currentPrice.times(item.quantity);
        totalHT = totalHT.plus(productTotal);

        const productTva = currentPrice.times(taxRate).times(item.quantity);
        tva = tva.plus(productTva);
      } else if (item.type === "Pack") {
        const pack = await Pack.findById(item.itemId);
        if (!pack) {
          throw new Error(`Pack with id ${item.itemId} not found`);
        }

        const currentPrice = new Decimal(pack.price.toString());
        const oldPrice = pack.oldPrice
          ? new Decimal(pack.oldPrice.toString())
          : null;

        if (oldPrice) {
          packDiscount = packDiscount.plus(oldPrice.minus(currentPrice));
        }

        const packTotal = currentPrice.times(item.quantity);
        totalHT = totalHT.plus(packTotal);

        const packTva = currentPrice.times(taxRate).times(item.quantity);
        tva = tva.plus(packTva);
      }
    }

    // Calculate total TTC
    totalTTC = totalHT
      .plus(tva)
      .plus(req.body.additionalCharges || 0)
      .plus(livraisonCost)
      .plus(advancedInfo.advanced.timber);

    // Apply promo code discount if active and valid
    if (promotionCode?.isActive || promotionCode?.endDate > new Date()) {
      discount = discount.plus(totalTTC.times(promotionCode?.discount));
    }
    discount = discount.plus(req.body.additionalDiscount || 0);
    // Calculate net amount to pay
    const netAPayer = totalTTC.minus(discount);
    let promoCodeObject;
    if (promoCode) {
      promoCodeObject =
        {
          id: promotionCode._id,
          code: promotionCode.code,
          value: promotionCode.discount,
        } || "";
    } else {
      promoCodeObject = "";
    }

    // Create and save the Vente
    const vente = new Vente({
      createdAt: new Date(req.body.createdAt),
      reference,
      client: {
        id: clientId,
        name: client.name,
        email: client.email || "",
        phone1: client.phone1,
        phone2: client.phone2 || "",
        ville: client.ville,
        address: client.address,
        clientNote: client.clientNote || "",
      },
      livreur: {
        name: livreur?.name || "",
        cin: livreur?.cin || "",
        carNumber: livreur?.carNumber || "",
      },
      items,
      tva: tva.toFixed(3),
      totalHT: totalHT.toFixed(3),
      totalTTC: totalTTC.toFixed(3),
      livraison: livraisonCost.toFixed(3),
      discount: discount.toFixed(3) || 0,
      additionalCharges: req.body.additionalCharges.toFixed(3),
      productsDiscount: productDiscount.toFixed(3),
      netAPayer: netAPayer.toFixed(3),
      note: req.body.note || "",
      modePayment: req.body.modePayment || "CASH",
      status: req.body.status || "pending",
      promoCode: promoCodeObject || "",
    });

    const savedVente = await vente.save();
    // Add Vente ID to Client's ordersId
    await Client.findByIdAndUpdate(clientId, {
      $push: { ordersId: savedVente._id },
    });
    res.status(201).json({ success: true, reference: savedVente.reference });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Vente",
      error: error.message,
    });
  }
};

exports.validatePromoCode = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Promo code is required" });
    }

    const promoCode = await PromoCode.findOne({ code: code.toString() });

    if (
      !promoCode ||
      !promoCode.status ||
      promoCode.endDate < new Date() ||
      promoCode.startDate > new Date()
    ) {
      return res
        .status(400)
        .json({ valid: false, message: "Invalid or expired promo code" });
    }

    res.json({
      valid: true,
      discountValue: promoCode.discount,
      code: promoCode.code,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error validating promo code", error: error.message });
  }
};

exports.getAllVentes = async (req, res) => {
  try {
    const vente = await Vente.find()
      .populate("client")
      .populate("promoCode")
      .populate("items.itemId")
      .sort("-reference");

    res.status(200).json({
      success: true,
      data: vente,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching purchase orders",
      error: error.message,
    });
  }
};

exports.updateVenteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const vente = await Vente.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate({
        path: "items.itemId",
        model: function () {
          return this.type === "Product" ? "Product" : "Pack";
        },
      })
      .populate("client");
    if (!vente) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vente,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating purchase order",
      error: error.message,
    });
  }
};

// Add a new update Vente method for full updates
exports.updateVente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client: newClientData,
      items,
      livreur,
      livraison,
      additionalCharges,
      additionalDiscount,
      createdAt,
      note,
      status,
      modePayment,
      ...otherUpdates
    } = req.body;

    // Fetch existing vente to get the old client ID
    const existingVente = await Vente.findById(id);
    if (!existingVente) {
      return res
        .status(404)
        .json({ success: false, message: "Vente not found" });
    }

    const oldClientId = existingVente.client.id.toString();
    const newClientId = newClientData?.id?.toString(); // From request body

    // If client ID is being changed
    if (newClientId && newClientId !== oldClientId) {
      // Validate new client exists
      const newClientExists = await Client.findById(newClientId);
      if (!newClientExists) {
        return res.status(400).json({ message: "New client not found" });
      }

      // Remove vente ID from old client's ordersId
      await Client.findByIdAndUpdate(oldClientId, {
        $pull: { ordersId: existingVente._id },
      });

      // Add vente ID to new client's ordersId
      await Client.findByIdAndUpdate(newClientId, {
        $addToSet: { ordersId: existingVente._id },
      });
    }

    const advancedInfo = await Information.findOne().select("advanced -_id");
    const taxRate = new Decimal(advancedInfo.advanced.tva || 0.19);

    // Initialize values
    let tva = new Decimal(0);
    let totalHT = new Decimal(0);
    let livraisonCost = new Decimal(
      livraison || advancedInfo.advanced.livraison || 0
    );
    let productDiscount = new Decimal(0);
    let packDiscount = new Decimal(0);
    let discount = new Decimal(0);
    let totalTTC = new Decimal(0);

    // Validate new promo code
    let promotionCode = existingVente.promoCode;
    // if (newPromoCode) {
    //   promotionCode = await PromoCode.findOne({ code: newPromoCode });
    //   if (!promotionCode) {
    //     return res.status(400).json({ message: "Promotion code not found" });
    //   }
    // }

    // Process items
    for (const item of items) {
      let currentItem;
      if (item.type === "Product") {
        currentItem = await Product.findById(item.itemId);
      } else if (item.type === "Pack") {
        currentItem = await Pack.findById(item.itemId);
      }
      if (!currentItem) {
        throw new Error(`${item.type} with id ${item.itemId} not found`);
      }

      const currentPrice = new Decimal(currentItem.price.toString());
      const oldPrice = currentItem.oldPrice
        ? new Decimal(currentItem.oldPrice.toString())
        : null;

      if (oldPrice) {
        if (item.type === "Product") {
          productDiscount = productDiscount.plus(
            oldPrice.minus(currentPrice).times(item.quantity)
          );
        } else {
          packDiscount = packDiscount.plus(
            oldPrice.minus(currentPrice).times(item.quantity)
          );
        }
      }

      const itemTotal = currentPrice.times(item.quantity);
      totalHT = totalHT.plus(itemTotal);
      tva = tva.plus(currentPrice.times(taxRate).times(item.quantity));
    }

    // Calculate TTC and discounts
    totalTTC = totalHT
      .plus(tva)
      .plus(additionalCharges || 0)
      .plus(livraisonCost)
      .plus(advancedInfo.advanced.timber);

    if (
      promotionCode?.isActive ||
      (promotionCode?.endDate && promotionCode.endDate > new Date())
    ) {
      discount = discount.plus(totalTTC.times(promotionCode.discount));
    }
    discount = discount.plus(additionalDiscount || 0);

    const netAPayer = totalTTC.minus(discount);

    // Construct promo code object
    let promoCodeObject = promotionCode
      ? {
          id: promotionCode._id,
          code: promotionCode.code,
          value: promotionCode.discount,
        }
      : "";

    // Update livreur with defaults
    const updatedLivreur = {
      name: livreur?.name || "",
      cin: livreur?.cin || "",
      carNumber: livreur?.carNumber || "",
    };

    // Prepare update data
    const updateData = {
      ...otherUpdates, // Spread other fields like items, livreur, totals, etc.
      client: {
        id: newClientId || existingVente.client.id, // Use new ID if provided
        name: newClientData?.name || existingVente.client.name,
        phone: newClientData?.phone || existingVente.client.phone,
        email: newClientData?.email || existingVente.client.email,
        address: newClientData?.address || existingVente.client.address,
        ville: newClientData?.ville || existingVente.client.ville,
        clientNote:
          newClientData?.clientNote || existingVente.client.clientNote,
        phone1: newClientData?.phone1 || existingVente.client.phone1,
        phone2: newClientData?.phone2 || existingVente.client.phone2,
      },
      updatedLivreur,
      items: items || existingVente.items, // Use updated items or existing ones
      tva: tva.toFixed(3),
      totalHT: totalHT.toFixed(3),
      totalTTC: totalTTC.toFixed(3),
      livraison: livraisonCost.toFixed(3),
      discount: discount.toFixed(3),
      additionalCharges: additionalCharges.toFixed(3),
      productsDiscount: productDiscount.plus(packDiscount).toFixed(3),
      netAPayer: netAPayer.toFixed(3),
      modePayment: modePayment || existingVente.modePayment,
      status: status || existingVente.status,
      note: note || existingVente.note,
      promoCode: promoCodeObject || existingVente.promoCode,
    };

    try {
      // Update the document without triggering Mongoose middleware
      let updatedVente;

      if (createdAt) {
        // Use MongoDB's native update operation to update createdAt
        await Vente.collection.updateOne(
          { _id: new mongoose.Types.ObjectId(id) },
          { $set: { createdAt: new Date(createdAt) } }
        );
      }

      // Now update the rest of the fields through Mongoose
      updatedVente = await Vente.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("items.itemId")
        .populate("client")
        .populate("promoCode");

      res.status(200).json({ success: true, data: updatedVente });
    } catch (updateError) {
      console.error("Error updating document:", updateError);
      res.status(500).json({
        success: false,
        message: "Error updating purchase order data",
        error: updateError.message,
      });
    }
  } catch (error) {
    console.error("Error in updateVente controller:", error);
    res.status(500).json({
      success: false,
      message: "Error processing purchase order",
      error: error.message,
    });
  }
};

exports.getVenteById = async (req, res) => {
  try {
    const vente = await Vente.findById(req.params.id)
      .populate("items.itemId")
      .populate("client")
      .populate("promoCode");

    if (!vente) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vente,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching purchase order",
      error: error.message,
    });
  }
};

exports.deleteVente = async (req, res) => {
  try {
    const vente = await Vente.findByIdAndDelete(req.params.id);

    if (!vente) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found",
      });
    }

    // Remove Vente ID from Client's ordersId
    await Client.findByIdAndUpdate(vente.client.id, {
      $pull: { ordersId: vente._id },
    });

    res.status(200).json({
      success: true,
      message: "Purchase order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting purchase order",
      error: error.message,
    });
  }
};

exports.deleteVenteMany = async (req, res) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Please provide a non-empty array of ventes IDs",
      });
    }

    const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Invalid ventes ID format",
        invalidIds,
      });
    }

    // Fetch ventes to map client associations
    const ventes = await Vente.find({ _id: { $in: ids } });
    const clientVentesMap = new Map();
    for (const vente of ventes) {
      const clientId = vente.client.id.toString();
      if (!clientVentesMap.has(clientId)) {
        clientVentesMap.set(clientId, []);
      }
      clientVentesMap.get(clientId).push(vente._id);
    }

    const deleteResult = await Vente.deleteMany({ _id: { $in: ids } });

    // Remove ventes from clients' ordersId
    for (const [clientId, venteIds] of clientVentesMap.entries()) {
      await Client.findByIdAndUpdate(clientId, {
        $pullAll: { ordersId: venteIds },
      });
    }

    return res.status(200).json({
      message: "Bulk delete operation completed",
      data: {
        deletedCount: deleteResult.deletedCount,
      },
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    return res.status(500).json({
      message: "Bulk delete operation failed",
      error: error.message,
    });
  }
};

exports.createCommandeVente = async (req, res) => {
  try {
    const reference = await generateReference();
    const advancedInfo = await Information.findOne().select("advanced -_id");
    const { items } = req.body;
    const { client } = req.body;
    const { livreur } = req.body;

    let clientId;
    const clientExists = await Client.findOne({
      $and: [{ email: client.email }, { phone1: client.phone1 }],
    });
    // Client handling
    if (!clientExists) {
      const newClient = new Client({
        name: client.name || "",
        email: client.email || "",
        phone1: client.phone1 || "",
        address: client.address || "",
        ville: client.ville || "",
      });
      const savedClient = await newClient.save();
      clientId = savedClient._id;
    } else {
      // Find client by email or phone

      if (!clientExists) {
        return res.status(400).json({ message: "Client not found" });
      }
      clientId = clientExists._id;
    }

    // Promo code handling remains the same
    const { promoCode } = req.body || "";
    let promotionCode = null;
    if (promoCode) {
      promotionCode = await PromoCode.findOne({ code: promoCode });
      if (!promotionCode) {
        return res.status(400).json({ message: "Promotion code not found" });
      }
    }

    // Initialize values
    let tva = new Decimal(0);
    let totalHT = new Decimal(0);
    let livraisonCost = new Decimal(req.body.livraison || 0);
    let productDiscount = new Decimal(0);
    let packDiscount = new Decimal(0);
    let discount = new Decimal(0);
    let totalTTC = new Decimal(0);
    const taxRate = new Decimal(advancedInfo.advanced.tva || 0.19);

    // Process items using slug instead of ID
    for (const item of items) {
      let currentItem;
      if (item.type === "Product") {
        currentItem = await Product.findOne({ slug: item.slug });
        if (!currentItem) {
          throw new Error(`Product with slug ${item.slug} not found`);
        }
      } else if (item.type === "Pack") {
        currentItem = await Pack.findOne({ slug: item.slug });
        if (!currentItem) {
          throw new Error(`Pack with slug ${item.slug} not found`);
        }
      }

      // Update item with found ID
      item.itemId = currentItem._id;

      const currentPrice = new Decimal(currentItem.price.toString());
      const oldPrice = currentItem.oldPrice
        ? new Decimal(currentItem.oldPrice.toString())
        : null;

      // Calculate discounts
      if (oldPrice) {
        const discountAmount = oldPrice
          .minus(currentPrice)
          .times(item.quantity);
        if (item.type === "Product") {
          productDiscount = productDiscount.plus(discountAmount);
        } else {
          packDiscount = packDiscount.plus(discountAmount);
        }
      }

      // Calculate totals
      const itemTotal = currentPrice.times(item.quantity);
      totalHT = totalHT.plus(itemTotal);
      tva = tva.plus(currentPrice.times(taxRate).times(item.quantity));
    }

    // Calculate TTC and apply promo
    totalTTC = totalHT
      .plus(tva)
      .plus(req.body.additionalCharges || 0)
      .plus(livraisonCost)
      .plus(advancedInfo.advanced.timber);

    if (promotionCode?.isActive || promotionCode?.endDate > new Date()) {
      discount = discount.plus(totalTTC.times(promotionCode?.discount));
    }
    discount = discount.plus(req.body.additionalDiscount || 0);

    const netAPayer = totalTTC.minus(discount);

    // Create Vente document
    const vente = new Vente({
      reference,
      client: {
        id: clientId,
        name: client.name,
        email: client.email || "",
        phone1: client.phone1,
        phone2: client.phone2 || "",
        ville: client.ville,
        address: client.address,
        clientNote: client.clientNote || "",
      },
      livreur: {
        name: livreur?.name || "",
        cin: livreur?.cin || "",
        carNumber: livreur?.carNumber || "",
      },
      items: items.map((item) => ({
        ...item,
        // Include both slug and ID for reference
        slug: item.slug,
        itemId: item.itemId,
      })),
      tva: tva.toFixed(3),
      totalHT: totalHT.toFixed(3),
      totalTTC: totalTTC.toFixed(3),
      livraison: livraisonCost.toFixed(3),
      discount: discount.toFixed(3) || 0,
      productsDiscount: productDiscount.toFixed(3),
      netAPayer: netAPayer.toFixed(3),
      note: req.body.note || "",
      modePayment: req.body.modePayment || "CASH",
      status: req.body.status || "pending",
      promoCode: promotionCode
        ? {
            id: promotionCode._id,
            code: promotionCode.code,
            value: promotionCode.discount,
          }
        : "",
    });

    const savedVente = await vente.save();
    await Client.findByIdAndUpdate(clientId, {
      $push: { ordersId: savedVente._id },
    });
    res.status(201).json({ success: true, reference: savedVente.reference });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Vente",
      error: error.message,
    });
  }
};
