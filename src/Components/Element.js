import React, { useState,useEffect }from 'react';
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

function Element(props)
{
  const [link, setLink ]=useState('')
  useEffect(()=>
  {
    getImage()
  },[])
  /* componentWillReceiveProps()
  {
    this.getImage()
  } */
  const getImage=()=>
  {
    //console.log(this.props.state);
    if(props.state!=='#state')
    {
      fetch(`https://api.giphy.com/v1/stickers/search?q=${props.state}&api_key=1936869e122e403a81f81326f1de0cfa&limit=1`)
      .then(res=>res.json())
      .then(res=>{
        setLink(res.data[0].images.downsized_medium.url);
        //console.log(res.data[0].images.downsized_medium.url);
      })
      .catch(e=>{console.log(`Failed to fetch image : ${e}`)})
    }
  }
    const { classes } = props;
    return(
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.root} elevation={1}>
          <div className={classes.spacing}>
            <Typography variant="h6" component="h3">
              {props.title}
            </Typography>
            {
              props.curr
              ?
              <Typography variant="h6" component="h3">
                {props.curr} °{props.celOn?'C':'F'}
              </Typography>
              :
              null
            }
            {
              props.high
              ?
              <Typography component='p'>Max: {props.high} °{props.celOn?'C':'F'}</Typography>
              :
              null
            }
            {
              props.low
              ?
              <Typography component='p'>Min :{props.low} °{props.celOn?'C':'F'}</Typography>
              :
              null
            }
          </div>
          {
            props.state
            ?
            <div>
            <Typography variant='h6' component="h3">      
              {props.state}
            </Typography>
            <img src={link} style={{height:'90px'}} alt={`${props.state}`}/>
            </div>
            :
            null
          }
        </Paper>
    </MuiThemeProvider>
    )
  }
export default withStyles(styles)(Element);