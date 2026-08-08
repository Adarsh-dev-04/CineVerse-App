const mongoose = require('mongoose')

const tagsSchema = {
    type:String,
}
const AppReviewSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique: true,
    },
    rating : {
        type: Number,
        required:true,
        min: 1,
        max: 5,
    },
    review : {
        type: String,
        maxlength: 1000
    },
    tags:[tagsSchema]
},{
    timestamps: true
})

const AppReview = mongoose.model("AppReview",AppReviewSchema);
module.exports = AppReview;