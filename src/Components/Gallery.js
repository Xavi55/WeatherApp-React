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
    const getData= async()=>
    {
		let base = 'https://weather.com/'
		let html = await request(base);
		const $ = cheerio.load(html);
		//let x = $('.wx-media-object-inner a').text();
		let element=$('div.mediaListItem')
		let img = $('img.image');
		let link = $('a.wx-media-image');
		//let x = $('.wx-media-content a').text();
		let text = $('div.wx-ellipsis-inner');
		let data=[];
		for(var i=0;i<8;i++)
		{
			let indx = i+1;
			data.push({
				original:img[i].attribs.src,
				description:indx+': '+text[i].firstChild.firstChild.data,
				url:base+link[i].attribs.href
			});
		}
      //console.log(data)
      /* let data = img.map(indx=>
        {
          return({
            original:img[indx].attribs.src,
            description:text[indx].firstChild.firstChild.data,
            //link:base+link[indx].attribs.href

          });
        }); */
      //console.log(text)
		setData(data);
      //console.log(text[0].firstChild.firstChild.data);
      //console.log(img[0].attribs.src);
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