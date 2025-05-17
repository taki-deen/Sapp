import Order from "../models/orders.js";
import User from "../models/User.js";
import ServiceType from "../models/ServiceType.js";

// Create a new order
const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

// Get all orders with filter
const getAllOrders = async (filter) => {
  const query = { ...filter };

  // Filter by location (case-insensitive)
  if (query.location) {
    const regex = new RegExp(query.location, "i");
    query.location = { $regex: regex };
  }

  // Filter by serviceType name
  if (query.serviceTypeName) {
    const serviceTypeRegex = new RegExp(query.serviceTypeName, "i");
    const matchedServiceTypes = await ServiceType.find({
      name: { $regex: serviceTypeRegex },
    });

    // Extract matching serviceType IDs
    const serviceTypeIds = matchedServiceTypes.map((st) => st._id);
    query.serviceType = { $in: serviceTypeIds };

    // remove the serviceTypeName from the query
    delete query.serviceTypeName;
  }

  return await Order.find(query)
    .populate("customerId", "name email")
    .populate("workerId", "name email")
    .populate("serviceType", "name");
};

// Get order by ID
const getOrderById = async (id) => {
  return await Order.findById(id)
    .populate("customerId", "name email")
    .populate("workerId", "name email")
    .populate("serviceType", "name");
};

// Update order status
const updateOrderStatus = async (id, status, user) => {
  const order = await Order.findById(id);
  if (!order) throw new Error("Service request not found");

  if (
    user.role === "worker" &&
    (!order.workerId || !order.workerId.equals(user._id))
  ) {
    throw new Error("Access denied");
  }

  order.status = status;
  return await order.save();
};

// Assign worker to order
const assignWorker = async (orderId, workerId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Service request not found");

  if (order.status !== "pending") {
    throw new Error("Job is not available for assignment");
  }
  //add validation to worker to ensuer he dont overlap with other order on that time
  order.workerId = workerId;
  order.status = "accepted";
  return await order.save();
};

// Rate worker
const rateWorker = async (orderId, customerId, rating) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Service request not found");

  if (!order.customerId.equals(customerId)) {
    throw new Error("Access denied");
  }

  if (order.status !== "completed") {
    throw new Error("Service not completed yet");
  }

  order.rating = rating;
  await order.save();

  // Update worker's ratings
  if (order.workerId) {
    await User.findByIdAndUpdate(order.workerId, {
      $push: { ratings: rating },
    });
  }

  return order;
};

// Delete order
const deleteOrder = async (orderId, user) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Service request not found");

  if (user.role !== "admin" && !order.customerId.equals(user._id)) {
    throw new Error("Access denied");
  }

  await order.deleteOne();
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  assignWorker,
  rateWorker,
  deleteOrder,
};
