import React from 'react';
import "./SettingPage.css"
import Switch from '@mui/material/Switch';

const Block = () => {
    return (
        <div className="Block">
            <p id='Intro'>Settings</p>
            <Switch id='SliderOne'>Button 1</Switch>
            <p> Settings </p>
            <br />
            <Switch id='SliderTwo'>Button 2</Switch>
        </div>
    )
}

export default Block;