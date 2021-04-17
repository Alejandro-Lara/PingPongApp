
import React from "react";
import './App.css';
import Game from "./Game.js";

function App() {
  
  const [playerNameFields, setPlayerNameFields] = React.useState({
    player1Name: "",
    player2Name: ""
  });

  const [gameState, setGameState] = React.useState({
    gameStarted: false,
    gameDone: false,
    player1Name: "",
    player2Name: "",
    player1Score: 0,
    player2Score: 0
  });

  const [LeaderboardState, setLeaderBoardState] = React.useState([]);

  const handlePlayer1Change = (event) =>{
    event.persist();
    setPlayerNameFields({
      player1Name: event.target.value,
      player2Name: playerNameFields.player2Name
    });
  }

  const handlePlayer2Change = (event) =>{
    event.persist();
    setPlayerNameFields({
      player1Name: playerNameFields.player1Name,
      player2Name: event.target.value
    });
  }

  const handlePlayerSubmit = (event) =>{
    event.preventDefault();

    if(playerNameFields.player1Name === "" || playerNameFields.player2Name ===""){
      return;
    }
    const requestBody = [
      {name: playerNameFields.player1Name, wins: 0, totalPoints: 0},
      {name: playerNameFields.player2Name, wins: 0, totalPoints: 0}
    ];

    const requestOptions = {
      method: 'Post',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    };

    fetch('http://127.0.0.1:5000/Players', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setGameState((gameState) => ({
          ...gameState,
          gameStarted:true
        }));
      });
    
    
    
  }

  const getLeaderboard = (event) =>{
    fetch('http://127.0.0.1:5000/Players')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setLeaderBoardState(data);
      });
  };

  return (
    <div className="App">
      <h1>Start a game: </h1>
      <form className = "PlayersForm" onSubmit = {handlePlayerSubmit}>
        <label htmlFor="player1">First Player: </label>
        <input type="text" id ="player1" 
          name="player1" value={playerNameFields.player1Name} onChange = {handlePlayer1Change}/>
        <br></br>
        <label htmlFor="player2">Second Player: </label>
        <input type="text" id ="player2" 
          name="player2" value={playerNameFields.player2Name} onChange = {handlePlayer2Change}/>
        <br></br>
        <input type="submit" value="Submit" />
      </form>

      {gameState.gameStarted && <Game player1Name
         ={playerNameFields.player1Name} player2Name={playerNameFields.player2Name} />}

      <button onClick = {getLeaderboard}>Get Leaderboard</button>
      <ol>
        {LeaderboardState.map((player,i) => {
          return <li key={i}><p><strong>Name:</strong> {player.name},  <strong>Wins:</strong>{player.wins},  <strong>Total-points:</strong>{player.totalPoints} </p></li>
        })}
      </ol>
    </div>
  );
}

export default App;
