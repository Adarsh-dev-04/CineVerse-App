const AppReview = require("../models/AppReviews");

const saveAppReviews = async (req, res) => {
  try {
    const userId = req.userId;
    const { rating, review, tags } = req.body;
    const updates = {};

    if (rating === undefined || rating === null) {
      return res.status(400).json({
        message:"Rating can not be blank"
      });
    }
    updates.rating = rating; 

    if (review !== undefined) {
      updates.review = review;
    }

    if(tags !== undefined)
    updates.tags = tags;

    const appReview = await AppReview.findOneAndUpdate(
      { userId },
      updates,
      { new: true, upsert: true, runValidators: true},
    );

    return res.status(200).json({
      message: "App Review Saved successfull",
      appReview
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

const getAppReview = async (req, res) => {
  try {
    const userId = req.userId;

    const appReview = await AppReview.findOne({ userId });

    return res.status(200).json({
      appReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

module.exports = {
  saveAppReviews,
  getAppReview,
};
