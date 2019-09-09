import React from 'react';
import {post} from 'axios'; //post 방식으로 보내기 위함
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const styles =theme =>({
    hidden:{
        display:'none'
    }
})

class CustomerAdd extends React.Component{
    //생성자 생성
    constructor(props){  
         super(props);
         //변수값 초기화
         this.state ={    
            file:null, //실제 bit 형식의 데이터 
            userName:'',
            birthday:'',
            gender:'',
            job:'',
            fileName:'', //파일 명
            open: false //Dialog 창이 열려있는지 check
         }
    }

    handleFormSubmit = (e) =>{
        e.preventDefault() //데이터가 서버에 전달할떄 오류 방지
        this.addCustmer() 
            .then((response)=> {  //서버로 부터 데이터가 건너왔을경우 포식
                  console.log(response.data);  
                  this.props.stateRefresh(); //App.js props 값으로 전달 받은 stateRefresh() 실행 
            })
        //입력 창 초기화
        this.setState({
            file:null,
            userName:'',
            birthday:'',
            gender:'',
            job:'',
            fileName:'',
            open:false
        })    
    }

    handleFileChange= (e) =>{
        this.setState({
            file:e.target.files[0], //하나의 파일만 추가하고 여러개중 하나면 선택하기위해
            fileName:e.target.value
        })
    }

    handleValueChange=(e)=>{
        let nextState= {};
        nextState[e.target.name]=e.target.value; //변경된 값을 받는다.
        this.setState(nextState);
    }

    addCustmer=()=>{
        const url= '/api/customers';
        const formData =new FormData();
        formData.append('image',this.state.file);
        formData.append('name',this.state.userName);
        formData.append('birthday',this.state.birthday);
        formData.append('gender',this.state.gender);
        formData.append('job',this.state.job);

        //파일이 포함된 데이터를 보낼때는 웹 표준에 맞게 보내기 위함
        const config ={
            headers:{
                'content-type':'multipart/form-data' //전달하고자 하는 데이터에 파일이 있을경우
            }       
        }
        return post(url,formData,config);
    }

    handleClickOpen=() =>{
        this.setState({
            open:true
        });
    }

    handleClose=() =>{
        this.setState({
            file:null,
            userName:'',
            birthday:'',
            gender:'',
            job:'',
            fileName:'',
            open:false
        })    
    }

    render(){
        //handFormSubmit :'고객 추가' 버튼 누르면 실행
        //handleFileCh :실제 파일을 보낼 준비가 되었을 경우
        //onChange :상태 변화 값 감지

        const {classes} =this.props;
        
        return(
            <div>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
                    고객 추가하기
                </Button>    
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>고객추가</DialogTitle>
                    <DialogContent>
                    프로필 이미지 : <input className={classes.hidden} accept="image/*" id="raised-button-file"  type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/><br/>
                       <label htmlFor="raised-button-file">
                            <Button variant="contained" color="primary" component="span" name="file">
                                {this.state.fileName ===""? "프로필 이미지 선택 " : this.state.fileName}
                            </Button>
                       </label>
                       <br/>

                       <TextField label="이름" type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/> 
                       <TextField label="생년월일"  type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}/><br/>
                       <TextField label="성별"  type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
                       <TextField label="직업"  type="text" name="job" value={this.state.job} onChange={this.handleValueChange}/><br/>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
                    </DialogActions>
                </Dialog>
             </div>   

        )
    }
}

export default withStyles(styles)(CustomerAdd);