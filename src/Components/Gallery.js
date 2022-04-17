import React, { useState, useEffect } from 'react';
//carosel component
import ImageGallery from 'react-image-gallery';
import "../../node_modules/react-image-gallery/styles/css/image-gallery.css";
//scapping
const request = require('request-promise');
const cheerio = require('cheerio');

function Gallery()
{
	const [ data, setData ] = useState([])
    const getData = async()=>
    {
		let base = 'https://weather.com/'
		let html = await request(base)
		const $ = cheerio.load(html)
		let link=$('a.mediaLink')
		let img=$('a.mediaLink img')
		let text=$('a.mediaLink span')
		//console.log("text",text)
		let data=[];
		for(var i=0;i<8;i++)
		{
			let indx = i+1;
			data.push({
				original:img[i].attribs.src,
				description:indx+': '+text[i].firstChild.data,
				url:base+link[i].attribs.href
			});
		}
		setData(data)
    }
    const link=(e)=>
    {
		//gallery starts at one, so [ data[-1] ]
		let indx = e.target.innerHTML[0];//innerHTML on HTMLnode= big help
		if(indx)
		{
			let x = window.open(data[indx-1].url,'_blank');
			x.focus();
		}
		else
		{
			console.log('pass');
		}
	}
	useEffect(()=>{
		getData()
	},[])
    /* const images = [
      {
        original: 'https://s.w-x.co/primary_summer.jpg',
        description:'#hahahaha'
      },
      {
        original: '',
        description: 'hoho'
      },
      {
        original: 'http://lorempixel.com/1000/600/nature/3/',
        description: 'hehe'
      }
    ] 
    */
	return (
		<ImageGallery 
			items={data} 
			showFullscreenButton={false} 
			showPlayButton={false}
			showThumbnails={false} 
			showBullets={true}
			showNav={true}
			slideInterval={6000} 
			autoPlay 
			onClick={(e)=>link(e)}
		/>
	)
}
export default Gallery;