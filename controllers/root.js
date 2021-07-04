exports.getHome = (req, res, next) => {
    res
    .status(200)
    .json({
        status : 200,
        data : {
            message : 'This is going to be the homepage.'
        },
        info : 'Success'
    })
}