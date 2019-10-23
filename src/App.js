import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Row, Col, Table } from 'react-bootstrap';
import './App.css';
import FacebookLogin from 'react-facebook-login';


function App() {
  // initalize
  const [board, setBoard] = useState(new Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState([]);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [history, setHistory] = useState(null);

  //Mouting
  const responseFacebook = (res) => {
    setUser(res);
    if (res) { setIsLogin(true) };
    console.log(res)
  }

  const postAPI = async () => {
    if (user) {
      let data = new URLSearchParams();
      data.append('player', user.name);
      data.append('score', 5e-324);
      const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
      const reponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data.toString(),
        json: true
      });
      console.log('result',reponse)
    }
  }
  if(gameOver){postAPI()};

  const getAPI = async()=>{
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const reponse = await fetch(url,{
      method: 'GET',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    });
    const data = await reponse.json();
    setHistory(data.items);
    console.log(data);
  }
  useEffect(()=>{
    getAPI()
  },[])

  // console.log(gameOver)

  // render UI
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          {isLogin ?
            <div className={'userInfo'}>
              <img src={user && user.picture.data.url} alt={'avatar'}></img>
              <p>Hi {user && user.name} !</p>
            </div>
            :
            <FacebookLogin
              // autoLoad={true}
              appId="973463813031353"
              fields="name,email,picture"
              callback={(resp) => { responseFacebook(resp);}}
            />
          }
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
              <History
                history={history}
              />
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
        const currentWinner = props.winner.concat(array[a])
        props.setWinner(currentWinner);
        props.setGameOver(true)
      }
    }
  }

  return (
    <>

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
    </>
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

function TableRow(props) {
  return (
    <tr>
      <td>{props.idx+1}</td>
      <td>{props.history[props.idx].player}</td>
      <td>{!props.history[props.idx].score ? Infinity : props.history[props.idx].score }</td>
      <td>{props.history[props.idx].createdAt}</td>
    </tr>
  )
}

function History(props) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>#</th>
          <th>User Name</th>
          <th>Core</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {props.history && props.history.map((el,idx)=>{
          return ( 
          <TableRow
            history={props.history}
            idx={idx}
          />)
        })}
      </tbody>
    </Table>
  )
}


