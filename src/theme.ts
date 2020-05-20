import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#005081'
    },
    secondary: {
      main: '#93201C'
    },
    background: {
      paper: (localStorage.getItem('dark') == 'true') ? '#424242' : '#fff'
    },
  }
});