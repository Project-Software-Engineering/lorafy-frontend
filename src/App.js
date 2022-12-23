import './App.css';
import React, { useState, useEffect, Component } from 'react';
import Chart from "react-apexcharts";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material';
import Button from '@mui/material/Button';
import ToggleButtonParameter from './parameter/toggleButtonParameter';
import Api from './Api';
import data from './jsonTest/data.json';
import sensor from './jsonTest/sensor.json'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      options: {
        chart: {
          id: "area-datetime"
        },
        xaxis: {
          categories: []
        },
        zoom: {
          autoScaleYaxis: true
        },
        legend: {
          position: 'right'
        }
      },
      series: [
        {
          name: "Enschede",
          data: []
        },
        {
          name: "Wierden",
          data: []
        },
        {
          name: "Gronau",
          data: []
        }
      ]
    };
  }
  componentDidMount() {
    this.fetchData('temperature');
  }
  
  fetchData = (value) => {

    const { items } = data;
    const combined = items.filter(device1 => {
      return sensor.items.some(device2 => device2.eui === device1.device_eui);
    }).map(device => {
      return {
        eui: device.device_eui,
        name: sensor.items.find(item => item.eui === device.device_eui)?.name,
        data: device.data,
        date: new Date(device.date).toLocaleDateString()
      }
    })
    const datesSet = new Set(combined.map(item => item.date));
    // Convert the set back to an array using Array.from
    const categories = Array.from(datesSet);

    // Use the value passed to the callback function to filter the data
    // and update the state with the new data
    const seriesDataSax = combined.filter(item => item.name === 'py-saxion').map(item => parseFloat(item.data[value]));
    const seriesDataGron = combined.filter(item => item.name === 'lht-gronau').map(item1 => parseFloat(item1.data[value]));
    const seriesDataWier = combined.filter(item => item.name === 'lht-gronau').map(item1 => parseFloat(item1.data[value]));

    this.setState({
      options: {
        ...this.state.options,
        xaxis: {
          categories
        }
      },
      series: [
        {
          ...this.state.series[0],
          data: seriesDataSax
        },
        {
          ...this.state.series[1],
          data: seriesDataWier
        },
        {
          ...this.state.series[2],
          data: seriesDataGron
        }
      ]
    });
  }
  render() {
    return (
      <div className="app">
        <div className='top'>
          {/* {getPosts} */}
        </div>
        <div className="container">
          <div className="button-container">
            <ToggleButtonParameter onChange={this.fetchData} />
          </div>
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="area"
              width="600"
            />
          </div>
        </div>
      </div>
    );
  }
}

//https://stackoverflow.com/questions/55583015/reactjs-fetch-parsing-json-into-multiple-objects
//https://stackoverflow.com/questions/45954705/how-to-log-exackly-one-object-from-fetched-json-data-in-react
export default App;
