import React, { useState } from 'react';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import OpacityIcon from '@mui/icons-material/Opacity';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { textAlign } from '@mui/system';
import componenDidMount from '../App';

// export default function ToggleButtonParameter({parameter, setParameter}) {
//     const [data, setData] = useState(null);

//     const handleToggle = (event, newParameter) =>{
//         Promise.all([
//             fetch('http://134.209.198.240:6969/api/data?datapoints=5&from=1670536693&to=1671141493&eui=70B3D5499ED96FBD '),
//             fetch('http://134.209.198.240:6969/api/end-device')
//         ]).then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
//         .then(([json1, json2]) => {
//             const data = json1.reduce((acc, item) =>{
//                 const matchinItem = json2.find(i=> i.eui ===item.device_eui);
//                 if(matchinItem){
//                     acc.push({...item, ...matchinItem});
//                 }
//                 return acc;
//             }, []);
//             setData(data);
//         })
//     }
//     return (
//         <div style={{}}>
//         <ToggleButtonGroup
//            orientation='vertical'
//            value={parameter}
//            exclusive
//            onChange={handleToggle}
//         >

//             <ToggleButton value={"temp"} aria-label = 'temperature'>
//                 <ThermostatIcon /></ToggleButton>
//             <ToggleButton value={"light"} aria-label = 'light'>
//                 <WbSunnyIcon /></ToggleButton>
//                 <ToggleButton value={"pressure"}aria-label = 'pressure'>
//                 <CloudDownloadIcon /></ToggleButton>
//                 <ToggleButton value={"humidity"} aria-label = 'humidity'>
//                 <OpacityIcon /></ToggleButton>
//         </ToggleButtonGroup>
//         </div>
//     );
// }
export default function ToggleButtonParameter(props) {
    const [parameter, setParameter] = useState(null);

    const handleChange = (event, newValue) => {
        setParameter(newValue);
        props.onChange(newValue);
    }

    return (
        <div style={{}}>
            <ToggleButtonGroup
                orientation='vertical'
                value={parameter}
                exclusive
                onChange={handleChange}
            >

                <ToggleButton value={"temperature"} aria-label='temperature'>
                    <ThermostatIcon /></ToggleButton>
                <ToggleButton value={"light"} aria-label='light'>
                    <WbSunnyIcon /></ToggleButton>
                <ToggleButton value={"pressure"} aria-label='pressure'>
                    <CloudDownloadIcon /></ToggleButton>
                <ToggleButton value={"humidity"} aria-label='humidity'>
                    <OpacityIcon /></ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}