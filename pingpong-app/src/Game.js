import React from "react";
//This is the game component

export default function Game(props){
    const player1Name = props.player1Name;
    const player2Name = props.player2Name;
    var Serving = 1;

    return (<div className="Game">
        <h1>Game Board</h1>
        <p>{Serving===1 && "Serving "}Player1: {player1Name}  Score: {0}</p>
        <button>Scored</button>
        <p>{Serving===2 && "Serving "}Player1: {player2Name}  Score: {0}</p>
        <button>Scored</button>
    </div>);


}