const order = await Order.findOne({
  _id: orderId,
  userId: req.user.id
});