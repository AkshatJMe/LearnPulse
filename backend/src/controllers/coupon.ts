import { Request, Response, NextFunction } from "express";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/errorHandler.js";

// Middleware to handle errors
export const errorHandler = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

// Controller to create a new coupon
export const newCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    code,
    discountPercent,
    discountAmount,
    discountType,
    expiryDate,
    maxUsage,
    courseId,
    minPurchaseAmount,
  } = req.body;

  if (!code || (!discountPercent && !discountAmount)) {
    return next(
      new ErrorHandler("Please enter coupon code and discount value", 400)
    );
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountPercent,
    discountAmount,
    discountType: discountType || "percent",
    expiryDate,
    maxUsage,
    courseId,
    minPurchaseAmount,
    isActive: true,
  });

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon.code} created successfully`,
    coupon,
  });
};

// Controller to apply a discount
export const applyDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { coupon: couponCode, amount, courseId } = req.query;

  const discount = await Coupon.findOne({ code: (couponCode as string).toUpperCase() });

  if (!discount) {
    return next(new ErrorHandler("Invalid coupon code", 400));
  }

  // Check if coupon is valid using the model method
  if (!(discount as any).isValid()) {
    return next(new ErrorHandler("Coupon has expired or reached maximum usage", 400));
  }

  // Check if coupon is course-specific
  if (discount.courseId && courseId && !discount.courseId.equals(String(courseId))) {
    return next(
      new ErrorHandler("This coupon is not applicable to this course", 400)
    );
  }

  // Check minimum purchase amount
  if (discount.minPurchaseAmount && Number(amount) < discount.minPurchaseAmount) {
    return next(
      new ErrorHandler(
        `Minimum purchase amount of $${discount.minPurchaseAmount} required`,
        400
      )
    );
  }

  // Calculate discount
  let discountValue = 0;
  if (discount.discountType === "percent") {
    discountValue = (Number(amount) * (discount.discountPercent || 0)) / 100;
  } else {
    discountValue = discount.discountAmount || 0;
  }

  return res.status(200).json({
    success: true,
    discount: discountValue,
    coupon: {
      code: discount.code,
      discountType: discount.discountType,
      discountPercent: discount.discountPercent,
      discountAmount: discount.discountAmount,
    },
  });
};

// Controller to get all coupons
export const allCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const coupons = await Coupon.find({});

  return res.status(200).json({
    success: true,
    coupons,
  });
};

// Controller to get a specific coupon by ID
export const getCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    return next(new ErrorHandler("Invalid Coupon ID", 400));
  }

  return res.status(200).json({
    success: true,
    coupon,
  });
};

// Controller to update an existing coupon
export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    code,
    discountPercent,
    discountAmount,
    discountType,
    expiryDate,
    maxUsage,
    courseId,
    minPurchaseAmount,
    isActive,
  } = req.body;

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    return next(new ErrorHandler("Invalid Coupon ID", 400));
  }

  if (code) coupon.code = code;
  if (discountPercent !== undefined) coupon.discountPercent = discountPercent;
  if (discountAmount !== undefined) coupon.discountAmount = discountAmount;
  if (discountType) coupon.discountType = discountType;
  if (expiryDate) coupon.expiryDate = expiryDate;
  if (maxUsage !== undefined) coupon.maxUsage = maxUsage;
  if (courseId) coupon.courseId = courseId;
  if (minPurchaseAmount !== undefined) coupon.minPurchaseAmount = minPurchaseAmount;
  if (isActive !== undefined) coupon.isActive = isActive;

  await coupon.save();

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} Updated Successfully`,
    coupon,
  });
};

// Controller to delete a coupon
export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    return next(new ErrorHandler("Invalid Coupon ID", 400));
  }

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} Deleted Successfully`,
  });
};
