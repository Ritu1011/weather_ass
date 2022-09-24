import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import "./style.css"
import {ImLocation} from 'react-icons/im';
import {BiSearch} from 'react-icons/bi';
import Chart from "react-apexcharts";

const Searchbox = () => {
    const [city, setCity] = useState([""])
    const [weather, setWeather] = useState([])
    const [display, setDisplay] = useState(true)
    const [cityName, setCityName] = useState('Indore')
    const [my,setMy]=useState("")
    const [humadity,setHumadity]=useState("")
    const Currentlocation = (e) => {
      axios
      .get("https://ipinfo.io/json?token=52ed0181817dc8")
      .then((response) => {
        setCityName(response.data.city)
        WeatherFetch(response.data.city)
        localStorage.setItem('cityName', JSON.stringify(response.data.city))
      })
    }
    const arr = useRef([])
    // console.log(my)
    useEffect(()=>{
      Currentlocation()
      },[])

    // console.log(weather)
    const AllDaysData = (latitude,longitude) => {
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=44d2f0f421a5b483b38e2ea12704107e&units=metric`)
      .then((res)=>{
      setWeather(res.data.daily)
      let day = res.data.daily[0].feels_like
           arr.current =  Object.values(day)
          }).catch((error)=>{
         console.log('error',error)
   
         })
       }

    const WeatherFetch = (cityname) => {
      let longitude; 
      let latitude;
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&cnt=7&appid=5c6004fc3786d57b9d23c346916d72e5&units=metric`).then((res)=>{
        longitude = res.data.city.coord.lon
        latitude = res.data.city.coord.lat
       
      }).catch((error)=>{
        console.log( error)
      })
       setTimeout(()=>{
        AllDaysData(latitude, longitude)
      },500)
      }
   


    const citiesFetch = (e) => {
      const {value} = e.target
           if(value.length !== 0){
        setDisplay(false)
        axios.get(`https://list-of-cities.herokuapp.com/cities`).then(({data})=>{
          let arr = data.filter((e) =>
          e.city.toLowerCase().includes(value)
            );
             setCity([...arr])
             setMy(e.target.value)
          }).catch((error)=>{
            console.log('error:', error)
          })
        }
        else{
        setDisplay(true)
          }
    }
         const fetchWeather = (el) => {
          setDisplay(true)
           WeatherFetch(el.city)
          setCityName(el.city)
          localStorage.setItem('cityName', JSON.stringify(el.city))
    }
   console.log(humadity)
  console.log(weather)
  return (
  <div className='desktop'>
  <div className='mobile_view'>
     <div className='serchContainer'>
        <div className='smallBox'>
            <div className='first_box'>
            <ImLocation style={{fontSize:"20px",marginTop:"10px"}}></ImLocation>
            <input type="text"  placeholder="serach" onChange={citiesFetch }  />
            </div>
            <div className='second_box'><BiSearch style={{fontSize:"20px",marginTop:"15px"}}></BiSearch></div>
        </div>
          </div>
          <div className='cityBox' style={{display: display ? "none" : 'block' }}>
           {city.map((e,index) => {
                    return(
                <div key={index} className='cityBox1'  onClick={()=>{fetchWeather(e)}} >
                  <span className='city'>{e.city}</span>  , <span className='state'>{e.state}</span>
                   
                </div>
              )
            })}
          
           </div>
      
     
            
     {/* ????????///////////Day////////////////////////// */}
      <h3>{cityName}</h3>
     <div className='outWeatherBox'>
            {weather.map((e, index)=>{
           return(
              <div key={index} className='main_waeathe_container' >
                 <h3  style={{margin:'0px'}}>{new Date(`${e.dt}`* 1000).toLocaleDateString("EN", {weekday: "short"})}</h3>
                  <div style={{display:"flex",margin:"auto"}}>
                    <h4 className='temprature'>{Math.round(e.temp.min)}°</h4>
                   <h4 className='temprature'>{Math.round(e.temp.max)}°</h4>
                   </div>
                   <img src={`https://openweathermap.org/img/wn/${e.weather[0].icon}.png`} alt="abc"  />
                <p style={{margin:'0px'}}>{e.weather[0].main}</p>
                {/* <p>{e.weather[0]}</p> */}
              </div>
            )
          })}
      </div>

{/* /////////////////CHART////////////////// */}

<div className='BottomBox'>
         <Chart id='chart_Data'
          type="area"
          series={[
            {
              name: "Temperature",
              data: [...arr.current],
            },
          ]}
          options={{
            dataLabels: {
              formatter:(val) => {
              },
            },
            xaxis: {
              categories: ["9:00am", "10:00am", "11:00pm", "12:00pm","1:00am","2:00am"],
            },
          }}
        />


 <div className='Data_Hm'>
         <div className='top_box'>
                <div>
                    <h3>Pressure</h3>
                    <p>1011ph</p>
                </div>
                <div>
                <h3>Humidity</h3>
                <p>33%</p>
                </div>
                </div>
                <div className='Bottom_box'>
                <div><h3>Sunrise</h3>
                <p>6:10am</p></div>
                <div><h3>Sunset</h3>
                    <p>5:45</p></div>
                </div>
               </div>
               </div>

          </div>
  </div>
  )
}

export default Searchbox
