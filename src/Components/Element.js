import React from 'react';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height:'auto',
    width:'auto',
    margin:'0 .5em .5em',
    display:'flex'
  },
  spacing:
  {
    flexGrow:1
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
      link:""
    };
  }
  
  getImage()
  {
    //console.log(this.props.state);
    fetch(`https://api.giphy.com/v1/stickers/search?q=${this.props.state}&api_key=1936869e122e403a81f81326f1de0cfa&limit=1`)
    .then(res=>res.json())
    .then(res=>{
      this.setState({link:res.data[0].images.downsized_medium.url});
      //console.log(res.data[0].images.downsized_medium.url);
    })
    .catch(e=>{console.log(`Failed to fetch image : ${e}`)})
  }

  componentWillReceiveProps()
  {
    this.getImage()
  }
  render() {

    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.root} elevation={1}>
          <div className={classes.spacing}>
            <Typography variant="h6" component="h3">
              {this.props.title}
            </Typography>
            {
              this.props.curr
              ?
              <Typography variant="h6" component="h3">
                {this.props.curr} °{this.props.celOn?'C':'F'}
              </Typography>
              :
              null
            }
            {
              this.props.high
              ?
              <Typography component='p'>Max: {this.props.high} °{this.props.celOn?'C':'F'}</Typography>
              :
              null
            }
            {
              this.props.low
              ?
              <Typography component='p'>Min :{this.props.low} °{this.props.celOn?'C':'F'}</Typography>
              :
              null
            }
          </div>
          {
            this.props.state
            ?
            <div>
            <Typography variant='h6' component="h3">      
              {this.props.state}
            </Typography>
            <img src={this.state.link} style={{height:'90px'}} alt={`${this.props.state}`}/>
            </div>
            :
            null
          }
        </Paper>
    </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Element);