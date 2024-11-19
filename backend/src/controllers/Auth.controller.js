const httpStatus = require("http-status");
const AuthService = require("../services/Auth.service")
const CatchAsync = require("../utils/CatchAsync")

class AuthController{
        static RegisterUser = CatchAsync(async(req,res)=>{
            const res_obj = await AuthService.RegisterUser(req.body);
            console.log("NODE_ENV: ", process.env.NODE_ENV)
            console.log('RES_OBJ FROM AUTH CONTROLLER: ', res_obj )
            console.log("HTTP STATUS: ", httpStatus.CREATED)
            res.status(201).send(res_obj)
        }) 
    static LoginUser = CatchAsync(async(req,res)=>{
            const res_obj = await AuthService.LoginUser(req.body);
            res.status(200).send(res_obj)
        })
          static ProfileController = CatchAsync(async(req,res)=>{
            const res_obj = await AuthService.ProfileService(req.user);
            res.status(200).send(res_obj)
        })
         
        
}

module.exports = AuthController