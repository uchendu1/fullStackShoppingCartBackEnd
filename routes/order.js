const router = require("express").Router();

const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(err);
  }
});

//delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

// get  one order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.findOne({userId: req.params.userId});

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  

  try {
    const orders = await Order.find();
    console.log(orders, "orders.......")
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET MONTHLY INCOME

// router.get("/income", verifyTokenAndAdmin, async (req, res) => {
//     const date = new Date();
//     const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
//     const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
//     try {
//       const income = await Order.aggregate([
//         { $match: { createdAt: { $gte: previousMonth } } },
//         {
//           $project: {
//             month: { $month: "$createdAt" },
//             sales: "$amount",
//           },
//         },
//         {
//           $group: {
//             _id: "$month",
//             total: { $sum: "$sales" },
//           },
//         },
//       ]);
//       res.status(200).json(income);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });


router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.productId
  const date = new Date();
  const oneMonthAgo = new Date(date.setMonth(date.getMonth() - 1));
  const twoMonthsAgo = new Date(new Date().setMonth(oneMonthAgo.getMonth() - 1));
  const threeMonthsAgo = new Date(new Date().setMonth(twoMonthsAgo.getMonth() - 1));


  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: threeMonthsAgo }, ...(productId && {
        products: { $elemMatch: {productId : productId}

        },
      }) } },  
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

