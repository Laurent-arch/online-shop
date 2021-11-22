const mongoDbStore = require('connect-mongodb-session');
const expressSession = require('express-session')

const createSessionStore = () => {
    const MongoDBStore = mongoDbStore(expressSession);

    const store = new MongoDBStore({
      uri: "mongodb+srv://Laurent:1234@cluster0.nxhpr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      databaseName: 'online-shop',
      collection: 'sessions'
 
    });

    return store;
}

const createSessionConfig = () => {
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    }
}

module.exports = createSessionConfig;