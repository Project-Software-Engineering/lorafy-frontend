import React from 'react';
import Avatar from '../components/Avatar';
import './AboutPage.css'
export default function AboutPage() {
  return (
    <>
      <h1>About Page</h1>
      <p> A team of five developers is hard at work on a new weather application. The team is composed of several individuals with different areas of expertise, including software engineers, data scientists, and a project manager.</p>
      <p>The software engineers are responsible for creating the actual code that runs the application, using languages such as Python, JavaScript and C#. They are working to build a sleek and user-friendly interface for the app, making it easy for users to access the information they need.</p>
      <p>The data scientist of the team is responsible for analyzing the data that is gathered from weather API, that the developers managed to create from scratch, and implement advanced algorithms to provide accurate representations of the data received from the sensors. They are also working to ensure that the information is presented to users in an easy-to-understand format.</p>
      <p>The project manager is responsible for coordinating the efforts of the team and ensuring that deadlines are met. He also work closely with the client to ensure that the final product meets their requirements and is delivered on time.</p>
      <p>The team works closely together, communicating regularly and constantly testing and refining the application as they go. They hold daily stand-up meetings to discuss progress and any issues that need to be addressed, and they also hold weekly meetings to review the overall progress of the project and expand the functinality even more.</p>
      <p>The team members are all experienced and highly skilled, and they are dedicated to creating the best possible weather application for their users.</p>
     
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Avatar name="Stefan Kichukov" github ="stefank02" backgroundColor="Red"/> 
      <Avatar name="Len Bauer" github ="wretch45" backgroundColor="Blue"/> 
      <Avatar name="Dave Huinink" github ="hanzelman" backgroundColor="Green"/>
      <Avatar name="Adelina Muchanga" github ="ababsmuc" backgroundColor="#F700ff" />
      <Avatar name="Stijn Stroeve" github ="stijnstroeve" backgroundColor="#F98D07"/>
      </div>


    </>
  );
}
