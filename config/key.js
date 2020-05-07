if(process.env.NODE_ENV == 'production'){
    module.exports = require('./prod.js');
}else{
    module.exports = requre('./dev.js');
}