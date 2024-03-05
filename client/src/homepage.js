'use strict';
import styled from 'styled-components';
import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';



function joinLobby (socket, id,setter,curState) {
  socket.emit('playerAdd',id);

  setter(!curState);
}
function exitMatchMaking(socket,id,setter, curState){
  socket.emit('RemovePlayer',id)
  setter(!curState);
}

const player = {
  id: Math.random().toString(36).substring(7),
};

const FrontPage = ({socket}) => {
  const [curState, setcurState] = useState(false);
 const history = useNavigate();
  

  socket.on('waiting', (players) => {
    console.log(players);
  });

  socket.on('Matched',(datas) => {
    
    console.log('Matched');
    console.log(datas);
    datas[0] = player.id;
    history('/fight' ,    
    { state: datas });
  });

  if(curState === true){
    return (<StyledFrontPage className='homeMain'>
    <h1 className = 'text'>Welcome to LeetFights</h1>
    <p className = 'text'>
     Searching for opponents.....
    </p>
    <button className="start-button"  onClick = {() => exitMatchMaking(socket,player.id,setcurState,curState)} >
  Stop Matching
        </button>
    button

  </StyledFrontPage>);
  }
  return (
      <StyledFrontPage className='homeMain'>
      <h1 className = 'text'>Welcome to LeetFights</h1>
      <p className = 'text'>
        Welcome to the Coding Battle Arena, where two developers face off in a
        thrilling coding competition!
      </p>
      <div className="button-container">
      <button className="start-button"  onClick = {() => joinLobby(socket,player.id,setcurState,curState)} >
  Start Battle
        </button>
        <button className="invite-button">Invite Friend</button>
      </div>
    </StyledFrontPage>
  
  );
};

const StyledFrontPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
  box-sizing: border-box;

  h1 {
    font-size: 36px;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    margin-bottom: 40px;
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 400px;
  }

  .start-button,
  .invite-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }

  .start-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
  }

  .invite-button {
    background-color: #6c757d;
    color: #fff;
    border: none;
    border-radius: 5px;
  }
`;


export default FrontPage;