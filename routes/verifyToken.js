const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    console.log("checking starts here ==============")
    console.log(authHeader, "authHeader ============", req.header, "req.headers.........." )
    console.log("checking stops here ==============")

    if(authHeader) {
        const token = authHeader.split(" ")[1];
        console.log(token, "token.........")
        console.log("checking stops here ==============")

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                console.log('token not valid', process.env.JWT_SECRET, err)
                res.status(403).json("Token not valid!"); return;
            }
            req.user = user
            next();
        })

    } else {
        return res.status(401).json("you are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () =>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        } else {
            res.status(403).json("You are not allowed to do that!!!")
        }
    })
}


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () =>{
        if(req.user.isAdmin){
            next()
        } else {
            res.status(403).json("You are not allowed to do that!!!")
        }
    })
}


module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}