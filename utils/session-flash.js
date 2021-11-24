const getSessionsData = (req) => {
    const sessionData = req.session.flashedData;

    req.session.flashedData = null;
    return sessionData;
};

const flashDataToSession = (req, data, action) => {
    req.session.flashedData = data;
    req.session.save(action);
};

module.exports = {
  getSessionsData,
  flashDataToSession,
};
