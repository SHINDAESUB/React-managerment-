import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider,createMuiTheme } from '@material-ui/core/styles';  // 1)index.css 에서 폰트를 받아와서 적용 하기 위함

const theme = createMuiTheme({                  //2)
    typography :{
        fontFamily: '"Noto Sans KR", serif',
    }
})

ReactDOM.render(<MuiThemeProvider theme={theme}> <App /></MuiThemeProvider>, document.getElementById('root')); // 3.<MuiThemeProvider theme={theme}> <App /></MuiThemeProvider> 감사준다.

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
