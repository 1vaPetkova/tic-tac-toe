import React from 'react';
import { useState } from 'react';

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [turnHistory, setTurnHistory] = useState([null]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAsc, setSortOrder] = useState(true);

  const xTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setTurnHistory([...turnHistory.slice(0, currentMove + 1), index]);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  function handleSort() {
    setSortOrder(!sortAsc)
  }

  const moves = history.map((squares, move) => {
    let position = turnHistory[move];
    let row = Math.floor(position/3);
    let col = position % 3;
    let description = move === 0 ? 'Go to the game start' : `Go to move ${move} (${row}, ${col})`;
    if (move === currentMove) {
      let position = move === 0 ? "" : `(${row}, ${col})`;
      return (
      <li key={move}>
        <div>You are at move {currentMove} {position}</div>
      </li>
      );
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  const movesSorted = sortAsc ? moves : moves.reverse();

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xTurn={xTurn} squares={currentSquares} onPlay={handlePlay} />
      </div>
     
      <div>
        <button className='toggle-order' onClick={handleSort}>Sort order: {sortAsc ? 'Asc' : 'Desc'}</button>
      </div>
      <div className='game-info'>
        <ul>{movesSorted}</ul>
      </div>
    </div>
  );
}


function Board({ xTurn, squares, onPlay }) {

  function handleClick(index) {
    console.log(index);
    if (checkForWinner(squares) || squares[index]) return;
    const nextSquares = squares.slice();
    nextSquares[index] = xTurn ? 'X' : "O";
    onPlay(nextSquares, index);
  }



  const gameWinner = checkForWinner(squares);
  const winnerValue = gameWinner ? gameWinner.winner : null;
  let status;
  if (winnerValue) {
    status = `The ${winnerValue} wins the game!`
   
  } else {
    if (!squares.filter(s => s === null).length) {
      status = 'Nobody wins!'
    } else {
      status = `The next player is: ${xTurn ? 'X' : 'O'}`
    }
  }

  return (
    <div>
      <div className='status'>{status}</div>
      <div>
      <Matrix squares={squares} handleClick={handleClick} gameWinner={gameWinner}/>  
      </div>
    </div>
  )
}

function Matrix ({squares, handleClick, gameWinner}) {
  let indices = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

  let squareBackground = (col) => { if (gameWinner && gameWinner.winningCombination.includes(col)) return "green"}

  return (
    <div>
    {indices.map(row =>
      <div key={row} className='board-row'>
        {
          row.map(col => 
            <Square key={col} value={squares[col]} onSquareClick={() => handleClick(col)} background={squareBackground(col)} />
          )
        }
      </div>
      
    )}
    </div>
  )
}

function Square({ value, onSquareClick, background }) {
  return <button className="square" onClick={onSquareClick} style={{background}}>{value}</button>;
}


function checkForWinner(squares) {
  let result = null;
  winningCombinations.forEach(([a, b, c]) => {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      result = {
        winner: squares[a],
        winningCombination: [a, b, c]
      };
    }
});
  return result;
}

