import React, { useState, useEffect } from 'react'

import { Toolbar, AppBar, Typography,
  List, Divider, ListItem, ListItemText, Drawer,
  TextField, Grid, Switch, FormControlLabel, FormGroup
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
//import { withStyles } from '@material-ui/core/styles';
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

function App()
{
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


const [ state, setState ] =useState(
	{
		currLocale:'#loc',
		currHigh:'#high',
		currLow:'#low',
		currState:'#state',
		currTemp:'#temp',
		zip:'',
		lat:0,
		longi:0,
		left:false,
		celsius:false,
		chartData:[
			{'name':'Min','data':{1:50,2:20,3:5,4:55,5:40}},
			{'name':'Max','data':{1:0,2:70,3:55,4:60,5:70}}
		],
		days:{}
	})
	
	let greet = '';
	if(today.getHours()>=11)
		greet=`Good afternoon, ${state.currLocale}`;
	else
		greet=`Good morning, ${state.currLocale}`;
	
	const updateField=(thing,value)=> 
	{
		setState({...state,[thing]:value})
	}

	useEffect(()=>
	{
		getLocal()
	},[])//on load

	const getLocal=()=>
	{
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(a)
			{
				
				var lat=a.coords.latitude;
				var longi=a.coords.longitude;
				//fetch('https://jsonplaceholder.typicode.com/todos/1')
				fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&units=imperial&appid=81bf6ab8b40197439ba85fbc537fbaac`)
				.then(res=>res.json())
				.then(res=>{
					//console.log(res);
					setState(prev=>{
						return{
							...prev,
							['currState']:res.weather[0].main,
							['currTemp']:res.main.temp,
							['currLow']:res.main.temp_min,
							['currHigh']:res.main.temp_max,
							['currLocale']:res.name+', '+res.sys.country,
						}
					//setTest(test+10)
					})
				}).catch(e=>console.log(`ERR: ${e}`))

				loadForecast(0,[lat,longi])
			})
		}
	}
	const subZip=()=>
	{
		if(state.zip.length===5)
		{
			fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${state.zip}&units=imperial&appid=81bf6ab8b40197439ba85fbc537fbaac`)
			.then(res=>res.json())
			.then(res=>{
				setState(prev=>
					{
						return{
							...prev,
							['currLocale']:res.name+', '+res.sys.country,
							['currTemp']:res.main.temp,
							['currHigh']:res.main.temp_max,
							['currLow']:res.main.temp_min,
							['currState']:res.weather[0].main
						}
					})
			})
			.catch(e=>console.log(`ERR: Failed to fetch zip : ${e}`))
			loadForecast(1,state.zip);
		}
		else
		{
			alert('Not a proper zipcode!')
		}
		setState(prev=>
			{
				return{
					...prev,
					['zip']:''
				}
			});
	}//clear
	
	const loadForecast=(code,data)=>
  	{
		switch(code)
		{
			case 0://via coordinates
				fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data[0]}&lon=${data[1]}&units=imperial&appid=81bf6ab8b40197439ba85fbc537fbaac`)
				.then(res=>res.json())
				.then(res=>{
					procData(res);
				})
				.catch(e=>console.log(`ERR: Failed to fetch forecast : ${e}`));
				break;
			case 1://via zipcode
				fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${data}&units=imperial&appid=81bf6ab8b40197439ba85fbc537fbaac`)
				.then(res=>res.json())
				.then(res=>{
					console.log('zipcode')
					procData(res);
				})
				.catch(e=>console.log(`ERR: Failed to fetch forecast : ${e}`));
				break;
			default:
				console.log('defaulted or Error');
		}
  }

	const procData=(data)=>
	{
		let count=today.getDay()+1
		let date = today.getDate()
		let castData = [{},{}]
		let min = 111
		let max = 0
		let cast={}
		//console.log(count)
		//console.log('forecast',data)
		for(var x in data.list)
		{
			if(count===7)
			{
				count=0;
			}
			if(parseInt(data.list[x].dt_txt[8]+data.list[x].dt_txt[9]) === date)
			{
				//skip todays weather data
				continue
			}
			
			//find min/max temp in this interval
			if(parseInt(data.list[x].dt_txt[11]+data.list[x].dt_txt[12])>=0 && parseInt(data.list[x].dt_txt[11]+data.list[x].dt_txt[12])<=18)
			{
				if(min>data.list[x].main.temp_min)
				{
					min=data.list[x].main.temp_min
				}
				if(max<data.list[x].main.temp_max)
				{
					max=data.list[x].main.temp_max
				}
				//castData[0][day[count]] = data.list[x].main.temp_min
				//castData[1][day[count]] = data.list[x].main.temp_max
			}
			//new day after 6pm, reset vars
			if(parseInt(data.list[x].dt_txt[11]+data.list[x].dt_txt[12])===18)
			{
				castData[0][day[count]]=min
				castData[1][day[count]]=max
				cast[day[count]]=[min,max]
				min=111
				max=0
				count++
			}
		}
		//console.log(castData)
		setState(prev=>{
			return{
				...prev,
				['chartData']:[{'name':'Min','data':castData[0]},
					{'name':'Max','data':castData[1]}],
				['days']:cast
			}
		})
	}

	const convert=()=>
	{
		//console.log(state.chartData)

		let tempDay={};
		let tempChart=[{},{}];
		let toggle=!state.celsius
		if(toggle)
		{
			Object.keys(state.days).map(x=>
			{
				tempDay[x]=[ swapTemp(1,state.days[x][0]),swapTemp(1,state.days[x][1]) ];
				tempChart[0][x]=swapTemp(1,state.days[x][0]);
				tempChart[1][x]=swapTemp(1,state.days[x][1]);
			});
		}
		else
		{
			Object.keys(state.days).map(x=>
			{
				tempDay[x]=[ swapTemp(0,state.days[x][0]),swapTemp(0,state.days[x][1]) ];
				tempChart[0][x]=swapTemp(0,state.days[x][0]);
				tempChart[1][x]=swapTemp(0,state.days[x][1]);
			});
		}
		setState(prev=>{
			return{
				...prev,
				['celsius']:!state.celsius,
				['days']:tempDay,
				['chartData']:[{'name':'Min','data':tempChart[1]},
					{'name':'Max','data':tempChart[0]}],
				['currHigh']:swapTemp(toggle,state.currHigh),
				['currLow']:swapTemp(toggle,state.currLow),
				['currTemp']:swapTemp(toggle,state.currTemp)
			}
		})
	}

	const swapTemp=(code,num)=>
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

	return(
		<div>
			<AppBar position='static'>
			<Toolbar color='inherit' variant='dense'>
				<IconButton onClick={()=>updateField('left',true)} className={styles.menuButton}><span style={{'color':'white'}}>☰</span></IconButton>
				<Drawer open={state.left} onClick={()=>updateField('left',false)}>
				<List>
					<ListItem>
					<ListItemText style={{textDecoration:'underline'}}>
						React Weather App
					</ListItemText>
					</ListItem>
					<ListItem>
					<ListItemText>
						Visit my website <a href='https://xavi55.github.io/webDos' target='_blank' rel='noopener noreferrer'>here</a>
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
				<Typography style={{display:'flex',flexGrow:'1'}} className={styles.spacing} color='inherit'>{greet}</Typography>&nbsp;
			<FormGroup>
				<FormControlLabel
				label="Celsius"
				control={
					<Switch 
						onChange={()=>convert()}
						checked={state.celsius}
					/>
				}
				/>
			</FormGroup>
				<TextField 
					inputProps={{maxLength:5}} 
					className={'zip'} 
					color='inherit' 
					placeholder='Enter a Zipcode...'
					value={state.zip}
					onChange={(e)=>updateField('zip',e.target.value)}
					onKeyDown={(e)=>{
						if(e.keyCode===13)
						{
							subZip();
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
				data={state.chartData}
			/>
			</div>
			<div className={'curr'}>
				<Element
					title="Today's weather" 
					curr={state.currTemp} 
					high={state.currHigh} 
					low={state.currLow} 
					state={state.currState} 
					celOn={state.celsius} 
				/>
			</div>
			<Grid container justify='center' spacing={0} className={styles.forecast}>
			{
				Object.keys(state.days).map(x=>
				{
					return(
						<Grid item key={x}>
							<Element 
								title={x}
								low={state.days[x][0]}
								high={state.days[x][1]}
								celOn={state.celsius}
							/>
						</Grid>
					)
				})
			}
			</Grid>
			<div id='slide'>
				{<Gallery />}
			</div>
		</div>
	)
}
export default (App);