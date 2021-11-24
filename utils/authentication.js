const createUserSession = (req, user, action) => {
    req.session.uid = user._id.toString();
    req.session.isAdmin = user.isAdmin;
    req.session.save(action)
}

const destroyUserSession = (req, res) => {
    req.session.uid = null;
}

module.exports = {
    createUserSession,
    destroyUserSession
}