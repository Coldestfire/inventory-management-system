const httpStatus = require("http-status"); 
const CatchAsync = require("../utils/CatchAsync");
const ConsumerService = require("../services/Consumer.service");

class ConsumerController{
            static RegisterConsumer= CatchAsync(async(req,res)=>{
                const res_obj  = await ConsumerService.RegisterConsumer(req?.user,req.body);
                return    res.status(201).json(res_obj)
                 
            })
             static updateById= CatchAsync(async(req,res)=>{
                const res_obj  = await ConsumerService.updateById(req?.user,req.body,req.params.id);
                return    res.status(200).json(res_obj)
                 
            })
            
              static getById= CatchAsync(async(req,res)=>{
                const res_obj  = await ConsumerService.getById(req?.user,req.params.id);
                return    res.status(200).json(res_obj)
                 
            })
            
             static GetAllUser= CatchAsync(async(req,res)=>{
                const res_obj  = await ConsumerService.GetAllUser(req?.user,req.query?.page,req.query?.query);
                return    res.status(200).json(res_obj)
                 
            })
  static DeleteConsumer= CatchAsync(async(req,res)=>{
                const res_obj  = await ConsumerService.DeleteConsumer(req?.user,req.params.id);
                return    res.status(200).json(res_obj)
                 
            })
             static GetUserForSearch= CatchAsync(async(req,res)=>{
                const res_obj  = await ConsumerService.GetUserForSearch(req?.user);
                return    res.status(200).json(res_obj)
                 
            })

             static DashboardData= CatchAsync(async(req,res)=>{
                const res_obj  = await ConsumerService.DashboardData(req?.user);
                return    res.status(200).json(res_obj)
                 
            })

             
            

            
}

module.exports = ConsumerController