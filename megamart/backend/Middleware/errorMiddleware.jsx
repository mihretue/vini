const errorMiddleWare = (err, req, res, next)=>{
    console.log('Error In Middle Ware');
    const statusCode = res.statusCode? res.statusCode : 500;
    res.status(statusCode)
    res.json({message: err.message, stack: process.env.NODE_ENV === "development" ? err.stack : null})
}

module.exports = errorMiddleWare