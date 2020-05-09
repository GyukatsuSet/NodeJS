const express = require('express');
const app = express();
const port = 1972;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {User} = require("./Models/Users");
const config = require('./config/key');

app.use(bodyParser.json());
// json 파일로 된 어플리케이션 분석

// 데이터 분석
app.use(bodyParser.urlencoded({
  extended: true
}));


// 몽고 DB 설정y
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true, 
    useFindAndModify:false
}).then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(Error))

app.get('/', (req, res) => res.send('규카츠 먹고싶다')); // 인사하는 코드


app.post('/register', (req, res) => {
  // 회원가입을 하면서 필요한 정보들을 clinet에서 가져오면
  // 데이터베이스에 넣어주는 코드

  const user = new User(req.body); // 유저
  
  user.save((err, doc) => {
    if(err) return res.json({
      success: false, err
    }) // 에러
    return res.status(200).json({ // 성공
      success: true,
    });
    
  });
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));