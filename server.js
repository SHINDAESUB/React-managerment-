const fs = require('fs'); //데이터베이스 환경 설정 정보 가져오기
const express =require('express');
const bodyParser =require('body-parser');
const app =express();
const port =process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//데이터베이스 
const data= fs.readFileSync('./database.json'); //파일 읽어오기
const conf= JSON.parse(data); //data를 파싱해서 가져오기
const mysql= require('mysql');
//데이터베이스 연결: 속성값을 입력을 받아서 연결 객체를 가져옴
const connection= mysql.createConnection({
    host:conf.host,
    user:conf.user,
    password:conf.password,
    port:conf.port,
    database:conf.database
});
//실제 접속 함수
connection.connect();

//파일 업로드 : 자동으로 파일이름을 중복되지 않기 해줌
const multer=require('multer');
//저장되는 파일경로
const upload=multer({dest:'./upload'});

//LIST 
app.get('/api/customers',(req,res)=> {
  connection.query(        
    "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
    (err,rows,fields) => {
        res.send(rows);  //rows 실제로 데이터가 담김
        console.log(`rows ${rows}`);
    }
    
  );

});

//사용자가 실제로 접근해서 공유 할수 있게 (경로,실제파일 위치)
app.use('/image',express.static('./upload'));

//INSERT
app.post('/api/customers',upload.single('image'),(req,res)=>{
  let sql='INSERT INTO CUSTOMER VALUES (null,?,?,?,?,?,now(),0)'; //db에초에 만들떄 key 값은 자동 추가
  let image= '/image/' + req.file.filename;
  let name=req.body.name;
  let birthday=req.body.birthday;
  let gender=req.body.gender;
  let job=req.body.job;
  let params=[image,name,birthday,gender,job];
  connection.query(sql,params,
     (err,rows,fields) =>{
        res.send(rows);
        console.log(err);
        console.log(rows);
     } 
    );
  
});

app.delete('/api/customers/:id',(req,res)=>{
  let sql='UPDATE CUSTOMER SET isDeleted = 1 WHERE id =?';
  let params = [req.params.id];
  connection.query(sql,params,
    (err,rows,fields) =>{
       res.send(rows);
       console.log(err);
       console.log(rows);
    } 
   );
});

app.listen(port, ()=>console.log(`Linste~!~! on port ${port}`));