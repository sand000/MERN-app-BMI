const moongoose = require("mongoose");

const BMISchema = new moongoose.Schema({
    BMI: {type: Number, required: true},
    height: {type: String, required: true},
    weight: {type: String, required: true},
    user_id: {type: String, required: true}
},{
    timestamps: true
});

const BMIModel = moongoose.model("bmi", BMISchema);

module.exports = {BMIModel}