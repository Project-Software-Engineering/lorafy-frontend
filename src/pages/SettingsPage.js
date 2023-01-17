<<<<<<< Updated upstream
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
=======
import useDocumentTitle from '../hooks/useDocumentTitle';
import Switch from '@mui/material/Switch';

export default function SettingsPage() {
  useDocumentTitle('Settings');

  return (
    <>
      <h1>Settings Page</h1>
      <div> 
            <Switch/> Setting 1  
            <p>Describe the setting</p>
            <Switch/> Setting 2
            <p>Describe the setting</p>
            <Switch/> Setting 3
            <p>Describe the setting</p>  

      </div>
    </>
  );
>>>>>>> Stashed changes
}

export default Block;