// const Vente = require("../models/Vente");

// const getTopSellingProducts = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;

//     const topProducts = await Vente.aggregate([
//       { $unwind: "$items" },
//       { $match: { "items.type": "Product" } },
//       {
//         $group: {
//           _id: "$items.itemId",
//           totalSold: { $sum: "$items.quantity" },
//           totalRevenue: {
//             $sum: { $multiply: ["$items.quantity", "$items.price"] },
//           },
//           designation: { $first: "$items.designation" },
//         },
//       },
//       { $sort: { totalSold: -1 } },
//       { $limit: limit },
//       {
//         $lookup: {
//           from: "products",
//           localField: "_id",
//           foreignField: "_id",
//           as: "productDetails",
//         },
//       },
//       { $unwind: "$productDetails" },
//       {
//         $project: {
//           _id: 1,
//           designation: 1,
//           totalSold: 1,
//           totalRevenue: 1,
//           image: "$productDetails.mainImage.url",
//           category: "$productDetails.category",
//           inStock: "$productDetails.inStock",
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       count: topProducts.length,
//       data: topProducts,
//     });
//   } catch (error) {
//     console.error("Error fetching top products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching top products",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   getTopSellingProducts,
// };
