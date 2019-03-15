import React from 'react';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height:'auto',
    width:'auto',
    margin:'1em'
  }
});

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
  typography: { useNextVariants: true },
});

class Element extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  
  render() {

    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h6" component="h3">
            {this.props.title}
          </Typography>
          <Typography variant="h6" component="h3">
            {this.props.curr} °F
          </Typography>
          {
            this.props.high
            ?
            <Typography component='p'>Max: {this.props.high} °F</Typography>
            :
            null
          }
          {
            this.props.low
            ?
            <Typography component='p'>Min :{this.props.low} °F</Typography>
            :
            null
          }
          {
            this.props.state
            ?
            <Typography component="p">      
              {this.props.state}
            </Typography>
            :
            null
          }
        </Paper>
    </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Element);