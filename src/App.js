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
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAsc, setSortOrder] = useState(true);
  const xTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  function handleSort() {
    setSortOrder(!sortAsc)
  }

  const moves = history.map((squares, move) => {
    let description = move === 0 ? 'Go to the game start' : `Go to move ${move}`;
    if (move === currentMove) {
      return (
      <li key={move}>
        <div>You are at move {currentMove}</div>
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
    if (checkForWinner(squares) || squares[index]) return;
    const nextSquares = squares.slice();
    nextSquares[index] = xTurn ? 'X' : "O";
    onPlay(nextSquares);
  }

  const winner = checkForWinner(squares);
  let status;
  if (winner) {
    status = `The ${winner} wins the game!`
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
      <Matrix squares={squares} handleClick={handleClick}/>  
      </div>
    </div>
  )
}

var indices = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

function Matrix ({squares, handleClick}) {
  return (
    indices.map(row =>
      <div className='board-row'>
        {
          row.map(col => 
            <Square value={squares[col]} onSquareClick={() => handleClick(col)} />
          )
        }
      </div>
    ));
}


function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}


function checkForWinner(squares) {
  let result = null;
  winningCombinations.forEach(([a, b, c]) => {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) result = squares[a];
  });
  return result;
}

