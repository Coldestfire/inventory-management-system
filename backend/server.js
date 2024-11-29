require("dotenv").config({

})
const { PUBLIC_DATA } = require("./constant");
const app = require("./src/app"); 
const { ConnectDB } = require("./src/config/db.config");
ConnectDB()





app.listen(PUBLIC_DATA.port,()=>{
    console.log(`the app is listening at Local:${PUBLIC_DATA.port}`);
})
