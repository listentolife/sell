var express = require('express');
var config = reqiure('./config/index');

var port process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(router);


// 声明变量读取data.json,并把数据中的seller,goods及ratings数据存放到对应的变量中
var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

// 定义路由api
var apiRoutes = express.Router();

// 路由接口
// seller路由接口
apiRoutes.get('/seller', function (req, res){
  res.json({
    errno: 0,
    data: seller
  });
});
// goods路由接口
apiRoutes.get('/goods', function (req, res){
  res.json({
    errno: 0,
    data: goods
  });
});
// ratings路由接口
apiRoutes.get('/ratings', function (req, res){
  res.json({
    errno: 0,
    data: ratings
  });
});

// 在express使用，需要用app.use方法调用
app.use('/api', apiRoutes);

app.use(express.static('./dist'))
