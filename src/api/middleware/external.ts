import env from "../../utils/env";;
const middleware = async (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        return res.sendStatus(401);
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token != env.API_TOKEN) {
        return res.sendStatus(401);
    }
    next();
};
export default middleware;