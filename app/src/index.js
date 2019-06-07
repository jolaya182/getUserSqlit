/* *
  title: index.js 

  date: 6/2/2019

  author: javier olaya

  description: where we place the Main component
         
 */
import React from 'react';
import ReactDom from 'react-dom';
import Main from './components/Main';

ReactDom.render((
  <div>
    <Main></Main>
  </div>
), document.getElementById("app"));