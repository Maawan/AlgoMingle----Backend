const mongoose = require("mongoose");
module.exports = function(){
    mongoose.connect(process.env.DB_URL)
    .then(console.log("DB connected Successfully :)")).catch((err) => {
        console.log("Error in Connecting DB ", err , process.env.DB_URL );
    })
}