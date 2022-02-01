const {createServer} = require('http');
const next = require('next');

const app = next({
  dev: process.env.NODE_ENV !== 'production'

});


const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.use((req,res, next)=>{
    res.setHeader('Access-Control-Allow-Origin',"http://localhost:3000");
    res.setHeader('Access-Control-Allow-Headers',"*");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.prepare().then(() => {
  createServer(handler).listen(3000, (err) =>{
    if (err) throw err;
    console.log('Ready on localhost:3000');
  });
});
