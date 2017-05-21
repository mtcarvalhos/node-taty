module.exports = {
    "IP" : process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    "PORT" :  process.env.OPENSHIFT_NODEJS_PORT || 8001,
    "MONGODB": process.env.MONGODB_URL,//|| 'mongodb://127.0.0.1:27017/taty',
    "MONGOLAB": 'mongodb://jmajor:sup0rt&ftp@ds125481.mlab.com:25481/moviesapp',
    "MONGODB_DATABASE": 'taty',
    "SECRET": "thiswebpageisawesomejsforlife"
}