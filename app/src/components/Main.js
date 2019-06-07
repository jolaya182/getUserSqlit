/* *
  title: Main.js 

  date: 5/28/2019

  author:  javier olaya

  description: the Main component that handles the main logic for accessing and displaying on the console the list of usernames
         
 */

import React from 'react';


export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results:null
    }
  }

  // gets all the data of the disallowed usernames
  handle1 = (e)=>{
    e.preventDefault();

    fetch("http://localhost:3000/disallowed_usernames").then((response)=>{
      return response.json();
    }).then((json)=>{ 
      console.log("handle1",json);
      this.setState((state, props)=>({results: JSON.stringify(json)}))
    }).catch((err)=>{
      console.log("the fetch has an error: ",err);
    });
  };  

  // gets all the data of the duplicated usernames and their new alias
  handle2 = (e)=>{
    e.preventDefault();
    fetch("http://localhost:3000/collisions").then((response)=>{
      return response.json();
    }).then((json)=>{ 
      console.log("handle2",json);
      this.setState((state, props)=>({results: JSON.stringify(json)}))
    }).catch((err)=>{
      console.log("the fetch has an error: ",err);
    });
  };

  // gets all the data where the disallowed names and the usernames are the same and they are renamed with new aliases with no duplicate usernames
  handle3 = (e)=>{
    e.preventDefault();
    fetch("http://localhost:3000/resolveDisallowedNames").then((response)=>{
      return response.json();
    }).then((json)=>{ 
      console.log("handle3",json);
      this.setState((state, props)=>({results: JSON.stringify(json)}))
    }).catch((err)=>{
      console.log("the fetch has an error: ",err);
    });

  };

  render() {
    const {handle1, handle2, handle3} = this;
    const {result} = this.state;
    console.log("results", result);
    return (
      <div>
        <button onClick={handle1}>handle1</button>
        <button onClick={handle2}>handle2</button>
        <button onClick={handle3}>handle3</button>
        {result ? <Results result={result}></Results> : null }

      </div>
    );
  }
}