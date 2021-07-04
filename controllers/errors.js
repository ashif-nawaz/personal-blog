exports.get404 = (req, res, next) => {
    res
    .status(404)
    .json({
        status : 404,
        message : 'No such endpoint exist on our server!',
        info : 'Failed'
    })
}


exports.getErrors = (error, req, res, next) => {
    console.log(error);
    let status = error.statusCode || 500;
    let data = error.data || null;
    let message = error.message || 'Something went wrong at our end, We are working on fixing it asap.';
    res
    .status(status)
    .json({
        status : status,
        message : message,
        data : data,
        info : 'Failed'
    })
}