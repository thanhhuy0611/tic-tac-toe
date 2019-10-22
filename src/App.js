import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Row, Col, Table } from 'react-bootstrap';
import './App.css';

function App() {
  // initalize
  const [board, setBoard] = useState(new Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  // const [XO,setXO] = useState("")
  console.log(gameOver)
  // render UI
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          React Bootstrap
        </Navbar.Brand>
      </Navbar>

      <Container>
        <Row>
          <Col>
            <div className={'playArea'}>
              <Board
                board={board}
                setBoard={setBoard}
                gameOver={gameOver}
                setGameOver={setGameOver}
                winner={winner}
                setWinner={setWinner}
              />
            </div>
          </Col>
          <Col>
            <div className={'historyArea'}>
              <History />
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );
}
export default App;


function Board(props) {

  // mouting
  const handleSquare = (index) => {
    if (props.gameOver) {
      return
    } //check game over
    let currentBoard = props.board.slice();
    let numberTurnRemainding = currentBoard.filter((el) => !el)
    if (currentBoard[index]) { return } // check clicked
    if (numberTurnRemainding.length % 2 === 0) { //check turn
      currentBoard[index] = 'x';
    } else {
      currentBoard[index] = 'o';
    }
    props.setBoard(currentBoard);
    checkWin(currentBoard);
    if (numberTurnRemainding.length === 1) { props.setGameOver(true) };
  };
  const checkWin = (array) => {
    const possibleCaseWin = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < possibleCaseWin.length; i++) {
      let [a, b, c] = possibleCaseWin[i];
      if (array[a] && array[a] === array[b] && array[b] === array[c]) {
        props.setWinner(array[a]);
        props.setGameOver(true)
      }
    }
  }

  return (
    <div className={'board'}>
      {props.board.map((el, idx) =>
        <Square
          id={idx}
          el={el}
          idx={idx}
          handleSquare={handleSquare}

        />
      )}
    </div>
  )
}

function Square(props) {
  const value = props.el;
  return (
    <div className={`square ${value === "x" ? "x" : null} ${value === "o" ? "o" : null}`}
      id={props.id}
      onClick={() => props.handleSquare(props.idx)}
    >
    </div>
  )
}

function History(props) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan="2">Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>
  )
}
