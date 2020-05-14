const express = require('express');
const app = express();
const port = 1972;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const {User} = require("./Models/Users");
const {auth} = require("./middleware/auth");
const config = require('./config/key');

app.use(bodyParser.json());
app.use(cookieParser());
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

  app.get('/', (req, res) => res.send('규카츠 먹고싶다')); // 입력
  app.get('/login/', (req, res) => res.send('호두과자 먹고싶다')); // 입력


app.post('api/users/register', (req, res) => {
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


app.post('api/users/login', (req, res) => {
// 요청된 이메일을 데이터베이스에 있는지 찾기
  User.findOne({email:req.body.email }, (err, user) =>{
    if(!user){
      return res.json({
        loginSucces : false,
        message : "규카츠 DB에 이메일이 읎어요."
      });
    }

    // 요청한 이메일이 있으면 비밀번호가 같은지 확인

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch){
        return res.json({ 
          loginSucces:false,
          message : "비밀번호가 틀렸습니다"
        });
      }
      // 비밀번호까지 같다면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // 토큰을 저장(여러 곳에 저장을 하지만 편히상 cookie로 저장)

          res.cookie("ID_Password", user.token)
            .status(200)
            .json({loginSucces:true, userID : user._id})
      });
    });
  });
});

// role 0 : 일반유저
// role 1 : 관리자
// role 2 : 특정 부서 관리자

app.post('/api/users/auth/', auth , (req, res) => {
  res.status(200).json({
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image
  });
});

// api/users : user에 관련된 api를 만들 때 넣으면 좋다(나중에 Express에서 제공되는 Router를 쓰면서 정리를 할 때 도움이 된다)


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));