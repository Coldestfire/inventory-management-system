const { default: mongoose } = require("mongoose");
const { PUBLIC_DATA } = require("../../constant");

exports.ConnectDB = async()=>{
    try {
        await mongoose.connect(PUBLIC_DATA.mongo_uri)
        console.log(`the app is connected to ${mongoose.connection.host}`);
    } catch (error) {
            mongoose.disconnect();
            console.log(PUBLIC_DATA.mongo_uri)
            console.log("MONGOOSE CONNECTION ERROR: ",error)
            process.exit(1)
    }
}