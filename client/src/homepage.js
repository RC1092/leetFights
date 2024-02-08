import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import './homepage.css';

const FrontPage = () => {
  return (
 
  
    <StyledFrontPage className='homeMain'>
      
      <h1 class = 'text'>Welcome to LeetFights</h1>
      <p class = 'text'>
        Welcome to the Coding Battle Arena, where two developers face off in a
        thrilling coding competition!
      </p>
      <div className="button-container">
      <Link className="start-button" to="/fight">
  Start Battle
</Link>
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