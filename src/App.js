import React from 'react';

import { Toolbar, AppBar, Typography,
  List, Button, Divider, ListItem, ListItemText, Drawer,
  TextField, Grid, Switch, FormControlLabel, FormGroup
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import './App.css';
import logo from './apiLogo.jpg';

//custom components
import Element from './Components/Element';
import Gallery from './Components/Gallery';

//charting components
import ReactChartkick, { AreaChart } from 'react-chartkick';
import Chart from 'chart.js';
ReactChartkick.addAdapter(Chart);

//81bf6ab8b40197439ba85fbc537fbaac

const styles = {
  spacing:{
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10,
  },
  /* curr:
  {
    height:'auto',
    width:'40%',
    margin:'1em'
  } */
  forecast:
  {
    margin:'0 auto'
  }
};

const day = {0:'Sun',1:'Mon',2:'Tues',3:'Wends',4:'Thurs',5:'Fri',6:'Sat'};
let today = new Date();


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currLocale:"...",
      currHigh:"",
      currTemp:"",
      currLow:"",
      currState:"...",
      zip:"",
      lat:0,
      longi:0,
      left:false,
      celsius:false,
      chartData:[
        {'name':'Min','data':{1:50,2:20,3:5,4:55,5:40}},
        {'name':'Max','data':{1:0,2:70,3:55,4:60,5:70}}
      ],
      days:{}
    };
  }

  handleChange=(event)=> {
    this.setState({
      zip:event.target.value
    });
  }

  subZip()
  {
    fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${this.state.zip}&units=imperial&appid=81bf6ab8b40197439ba85fbc537fbaac`)
    .then(res=>res.json())
    .then(res=>{
      this.setState({
        currLocale:res.name+', '+res.sys.country,
        currTemp:res.main.temp,
        currHigh:res.main.temp_max,
        currLow:res.main.temp_min,
        currState:res.weather[0].main
      });
    })
    .catch(e=>console.log(`ERR: Failed to fetch zip : ${e}`))

    this.loadForecast(1,this.state.zip);
    this.setState({zip:""});//clear
  }

  getLocal()
  {
    let self = this;//BIG

    if(navigator.geolocation)
    {
		  navigator.geolocation.getCurrentPosition(function(a)
		  {
			  var lat=a.coords.latitude;
        var longi=a.coords.longitude;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&units=imperial&appid=81bf6ab8b40197439ba85fbc537fbaac`)
        .then(res=>res.json())
        .then(res=>{
          //console.log(res);
          self.setState({
            currLocale:res.name+', '+res.sys.country,
            currTemp:res.main.temp,
            currHigh:res.main.temp_max,
            currLow:res.main.temp_min,
            currState:res.weather[0].main
          });

        })
        .catch(e=>console.log(`ERR: ${e}`));

        self.loadForecast(0,[lat,longi]);
      });
    }
  }

  
  switch(code,num)
  {
    if(code)
    {
      return(Math.round((num-32)*(5/9)*100)/100);//to celsius
    }
    else
    {
      return(Math.round((num*(9/5)+32)*100)/100);//to fahrenheit
    }

  }

  convert(type)
  {
    let tempDay={};
    let tempChart=[{},{}];
    if(!type)
    {
      Object.keys(this.state.days).map(x=>
        {
          tempDay[x]=[ this.switch(1,this.state.days[x][0]),this.switch(1,this.state.days[x][1]) ];
          tempChart[0][x]=this.switch(1,this.state.days[x][0]);
          tempChart[1][x]=this.switch(1,this.state.days[x][1]);
        });

      this.setState({
        celsius:!this.state.celsius,
        days:tempDay,
        chartData:[{'name':'Min','data':tempChart[1]},
        {'name':'Max','data':tempChart[0]}],
        currHigh:this.switch(1,this.state.currHigh),
        currLow:this.switch(1,this.state.currLow),
        currTemp:this.switch(1,this.state.currTemp)
    });
    }
    else
    {
      Object.keys(this.state.days).map(x=>
        {
          tempDay[x]=[ this.switch(0,this.state.days[x][0]),this.switch(0,this.state.days[x][1]) ];
          tempChart[0][x]=this.switch(0,this.state.days[x][0]);
          tempChart[1][x]=this.switch(0,this.state.days[x][1]);
        });
      this.setState({
        celsius:!this.state.celsius,
        days:tempDay,
        chartData:[{'name':'Min','data':tempChart[1]},
          {'name':'Max','data':tempChart[0]}],
        currHigh:this.switch(0,this.state.currHigh),
        currLow:this.switch(0,this.state.currLow),
        currTemp:this.switch(0,this.state.currTemp)
      });
    }
  }

  loadForecast(code,data)
  {
    switch(code)
    {
      case 0://via coordinates
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data[0]}&lon=${data[1]}&units=imperial&appid=81bf6ab8b40197439ba85fbc537fbaac`)
        .then(res=>res.json())
        .then(res=>{
          this.procData(res);
        })
        .catch(e=>console.log(`ERR: Failed to fetch forecast : ${e}`));
        break;
      case 1://via zipcode
      fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${data}&units=imperial&appid=81bf6ab8b40197439ba85fbc537fbaac`)
      .then(res=>res.json())
      .then(res=>{
        this.procData(res);
      })
      .catch(e=>console.log(`ERR: Failed to fetch forecast : ${e}`));
        break;
      default:
        console.log('defaulted or Error');
    }
  }

  procData(data)
  {
    let count=today.getDay()+1;
    //let castData = {};
    let castData = [{},{}];
    let date = today.getDate();
    let iter = 0;
    let min = 111;
    let max = 0;

    let cast={}
    for(var x in data.list)
    {
      if(count===7)
      {
        count=0;
      }
      if(parseInt(data.list[x].dt_txt[8]+data.list[x].dt_txt[9]) !== date)
      {
        if(iter===7)//get min/max temp within 8 iterations
        {
          //console.log(max);
          castData[0][day[count]] = max;
          castData[1][day[count]] = min;
          cast[day[count]] = [max,min];
          min=111;
          max=0;
          count++;
          iter=0;
        }
        else
        {
          if( data.list[x].main.temp > max )
          {
            max = data.list[x].main.temp;
          }
          if( data.list[x].main.temp < min )
          {
            min = data.list[x].main.temp
          }
          iter++;
        }
      }
      //console.log(data.list[x]);
/*
      if(parseInt(data.list[x].dt_txt[11]+data.list[x].dt_txt[12])===12)
      {
        castData[day[count]] = data.list[x].main.temp
        count++;
      } */
    }
    //console.log(castData);
    this.setState({chartData:[{'name':'Min','data':castData[1]},{'name':'Max','data':castData[0]}],days:cast});    
  }

  componentWillMount()
  {
    this.getLocal();//retrieve user local location
  }

  render() {
    const { classes } = this.props;

    const images = [
      {
        original: 'http://lorempixel.com/1000/600/nature/1/',
        thumbnail: 'http://lorempixel.com/250/150/nature/1/',
        originalTitle: '#TITLE',
        description: '#caption-here'
      },
      {
        original: 'http://lorempixel.com/1000/600/nature/2/',
        thumbnail: 'http://lorempixel.com/250/150/nature/2/'
      },
      {
        original: 'http://lorempixel.com/1000/600/nature/3/',
        thumbnail: 'http://lorempixel.com/250/150/nature/3/'
      }
    ]


    let greet = '';
    if(today.getHours()>=11)
	    greet=`Good afternoon, ${this.state.currLocale}`;
    else
      greet=`Good morning, ${this.state.currLocale}`;

    return (
      <div>
        <AppBar position='static'>
          <Toolbar color='inherit' variant='dense'>
            <IconButton onClick={()=>this.setState({left:true})} className={classes.menuButton}><span style={{'color':'white'}}>☰</span></IconButton>
            <Drawer open={this.state.left} onClick={()=>this.setState({left:false})}>
              <List>
                <ListItem>
                  <ListItemText style={{textDecoration:'underline'}}>
                    React Weather App
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Visit my website <a href='https://xavi55.github.io.' target='_blank' rel='noopener noreferrer'>here</a>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Check out the old version <a href='https://xavi55.github.io/weatherApp' target='_blank' rel='noopener noreferrer'>here</a>
                  </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                  <ListItemText>
                    Kevin Gamez - 2019
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Powered with: <a href='https://openweathermap.org/api'><img style={{height:'auto',width:'1em'}} src={logo} alt='openWeatherMap-Logo'/></a> OpenWeatherMap
                  </ListItemText>
                </ListItem>
              </List>
            </Drawer>
            <Typography className={classes.spacing} color='inherit'>{greet}</Typography>&nbsp;
           <FormGroup>
             <FormControlLabel
              label="Celsius"
              control={
                <Switch 
                  onChange={()=>{this.convert(this.state.celsius)}}
                  checked={this.state.celsius}
                />
              }
             />
           </FormGroup>
            <TextField 
              inputProps={{maxLength:5}} 
              className={'zip'} 
              color='inherit' 
              placeholder='Enter a Zipcode...'
              value={this.state.zip}
              onChange={this.handleChange}
              onKeyDown={(e)=>{
              if(e.keyCode===13)
              {
                this.subZip();
              }
            }}
            >
            </TextField>
          </Toolbar>
        </AppBar>
        <div className={'chart'}>
          <AreaChart
            legend='left'
            ytitle="Temperature"
            messages={{empty:"No data"}} 
            library={{
              scales: {
                yAxes: [
                  {
                    ticks: { fontColor: "#fff" },
                    scaleLabel: { fontColor: "#fff" }
                  }
                ],
                xAxes: [
                  {
                    ticks: { fontColor: "#fff" }
                  }
                ]

              },
              title:{
                fontColor:'#fff'
              },
              label:
              {
                fontColor:'fff'
              }
            }}
            data={this.state.chartData}
          />
        </div>
        <div className={'curr'}>
          <Element curr={this.state.currTemp} high={this.state.currHigh} low={this.state.currLow} state={this.state.currState} title="Today's weather"/>
        </div>
        <Grid container justify='center' spacing={0} className={classes.forecast}>
          {
            Object.keys(this.state.days).map(x=>
              {
                return(<Grid item key={x}><Element title={x} high={this.state.days[x][0]} low={this.state.days[x][1]} /></Grid>)
              })
          }
        </Grid>
        <div id='slide'>
          <Gallery 
            
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);