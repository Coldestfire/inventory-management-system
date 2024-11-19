const CatchAsync = (fn)=>(req,res,next)=>{
    return Promise.resolve(fn(req,res,next)).catch((e)=>{
        console.log("promise cannot be resolved")
        next(e)
    })
}

module.exports = CatchAsync