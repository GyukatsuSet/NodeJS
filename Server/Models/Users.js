//user model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRonds = 10; // salt 글자수
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema

const UserSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength : 50
    },
    email: {
        type : String,
        trim : true,
        unique : 1
    },
    password: {
        type : String,
        minlength : 5
    },
    lastname: {
        type : String,
        maxlength : 50
    },
    role: {
        type: Number,
        default : 0
    },
    image : String,
    token: {
        type : String
    },
    tokenExp: {
        type : Number
    }
});

//비밀번호를 암호화 하는 코드
UserSchema.pre('save', function(next){
    var user = this;
    // user 스키마 가리키기
    if(user.isModified('password')){
        //비밀번호만 변경이 된다면
        bcrypt.genSalt(saltRonds, function(err, salt){
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                
                user.password = hash;
                console.log("Your password has been locked");
                next();
                // hash : 비밀번호를 암호화 시키기
                 //next() : 설정을 다한다음에 mongoDB로 보내는 곳으로 전송
            });
        });
    }else{
        next();
    }
});
//moongoose에서 가져오는 매소드

UserSchema.methods.comparePassword = function(plainPassword, cb){

    // planpassword
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err); // false
        cb(null, isMatch); // true
    });

}

UserSchema.methods.generateToken = function (cb){

    var user = this;
    //jsonwebtoken을 이용해서 token을 생성
    
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    });

}

const User = mongoose.model('User', UserSchema);

module.exports = {User};