import React,{Component} from 'react';
import './App.css';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withStyles} from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';


const styles = theme =>({
  root:{
    width: '100%',
    minWidth: 1080
   // overflowX:"auto" //x축에는 오버플로우가 발생할수 있도록
  },
  menu:{
    marginTop:15,
    marginBottom:15,
    display:'flex',
    justifyContent:"center"
  },
  paper:{
    marginLeft: 18,
    marginRight:18
  },
  // table:{
  //   minWidth: 1080 //전체 1080px 을 생성되서 테이블 상태 유지,  가로 스크롤바가 생성
  // },
  progress:{
    margin : theme.spacing.unit * 2
  },
  grow :{
    flexGrow: 1,
  },
  tableHead:{
    fontSize: '1.0rem'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

/* react component 실행 순서 

  1) constructor()

  2) componentWillMount()

  3) render()

  4) componenetDidMount()

*/
/*
  props or state 변경되는 경우엔 => shouldComponentUpdate() 사용되서 알아서 다시 render() 함수 실행 
*/



// jsx 문법은 반드시 div 태그로 감싸줘야 한다.
class App extends Component{

  //state 초기화
  constructor(props){
    super(props);
    this.state={
      customers:'',
      completed:0,
      searchKeyword: ''  
    }
  }

  stateRefresh=()=>{
    this.setState({
      customers:'',
      completed:0,
      searchKeyword: ''  //추가 및 삭제 일경우 검색창 비워짐
    });
    this.callApi() 
      .then(res => this.setState({customers: res}) ) //*4번  데이터를 받아서 state로 설정함 
      .catch(err =>console.log(err))
  }

  //*1번 componentDidMount 모든 컴포넌트가 모두 완료가 되었을떄 사용   
  componentDidMount(){   
    this.timer = setInterval(this.progress,20); //0.02 초 마다 progress 실행 
    this.callApi() 
      .then(res => this.setState({customers: res}) ) //*4번  데이터를 받아서 state로 설정함 
      .catch(err =>console.log(err))
  }

  callApi=async() =>{  //*3번
    const response = await fetch('/api/customers'); //api 에 접속 하기 위함
    const body = await response.json(); //json 형태롤 받아서 넣음
    return body;
  }

  progress =() =>{
    const {completed} =this.state; 
    this.setState({completed:completed >= 100 ? 0 : completed +1});  
  }

  handleValueChage =(e)=>{
    let nextState ={};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  render(){
    const filteredComponents =(data) =>{   
      data= data.filter((c) =>{                                 //데이터가 배열형태로 존재 한다고 했을경우 
        return c.name.indexOf(this.state.searchKeyword) > -1;   //각 원소중에서 원소의 이름 값에 검색한 searchKeyword 값이 포함 있을경우
      })
      return data.map((c) =>{
          return <Customer stateRefresh={this.stateRefresh} 
          key={c.id}                         
          id={c.id}
          name={c.name}
          image={c.image}
          birthday={c.birthday}
          gender={c.gender}
          job={c.job} />
      });
    }
    const { classes } =this.props;
    const cellList =["번호", "프로필이미지","이름","생년월일","성별","직업","설정"]
    return(
     <div className={classes.root}>    
       <AppBar position="static" >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            고객 관리 시스템
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="검색하기"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              name="searchKeyword"
              value={this.state.searchKeyword}  //변경된 값
              onChange={this.handleValueChage}
            />
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.menu}>
        <CustomerAdd stateRefresh={this.stateRefresh}/> 
      </div>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                  {cellList.map(c=>{
                    return <TableCell className={classes.tableHead}>{c}</TableCell>
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
               {this.state.customers ? 
                  filteredComponents(this.state.customers) :            
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}>
                    </CircularProgress>
                  </TableCell>
                </TableRow>
                } 
              {/* 기존의 검색 기능 없을 경우에 양식  */}
              {/* {this.state.customers ? this.state.customers.map(c=> {     //this.state.customers 이 true 일 경우에는 실행 아니면 로딩이 실행된다.
                    return( <Customer stateRefresh={this.stateRefresh}  key={c.id}  //map을 사용할떄는 키값을 지정 해줘야된다.
                        id={c.id}
                        name={c.name}
                        image={c.image}
                        birthday={c.birthday}
                        gender={c.gender}
                        job={c.job}
                      />
                    );
                }) :  */}          
            </TableBody>
          </Table>
        </Paper> 
     </div>      
    )
  }
}

export default withStyles(styles)(App);
