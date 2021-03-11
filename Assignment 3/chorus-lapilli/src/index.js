import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* Outline
 1: Set up a constructor variable for X's and O's
 2. Set up a limit for 3 X's and 3 O's
 3. Set up a way for a player to either click on an X or O, and delete that X or O and have only 2 place holders (X or O)
 4. Then have the player only place an X or an O in a empty box around an existing X or O
 5. If there is 3 pieces on the board & one of the peices is in the center square: 
    In next turn: must win or delete that placeholder in the center*/

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            //true = X, false = O
            xIsNext: true, 
            //Step 1 
            X: 0, 
            O: 0,

            //step 4
            deletedPlace: null, 

            //step 5
            xIsInCenter: null,
            oIsInCenter: null,
            xHasWon: false,
            oHasWon: false, 
        };
    }

    //step 4
    possibleLoc(i) {
        if (i === 0) {
            return [1, 3, 4]
        }
        else if (i === 1) {
            return [0, 3, 4, 5, 2]
        }
        else if (i === 2) {
            return [1, 4, 5]
        }
        else if (i === 3) {
            return [0, 1, 4, 7, 6]
        }
        else if (i === 4) {
            return [0, 1, 2, 3, 5, 6, 7, 8]
        }
        else if (i === 5) {
            return [2, 1, 4, 7, 8]
        }
        else if (i === 6) {
            return [3, 4, 7]
        }
        else if (i === 7) {
            return [6, 3, 4, 5, 8]
        }
        else {
            return [5, 4, 7]
        }
    }

    handleClick(i) {

        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        //if (calculateWinner(squares) || squares[i]) {
        //can't have both as squares[i], with deleting then adding something, will just put that deleted X back
        //to where I just deleted it
        //added the xHasWon and oHasWon for the step 5
        if (calculateWinner(squares) || this.state.xHasWon === true || this.state.oHasWon === true) {
            return;
        }

        //after there are 3 x's or 3 O's
        //the player must delete or null an X or O, 
        // which decreaes the # of X's or O's by 1

        //tried if ((this.state.turns >= 6) && (this.state.X >= 3 || this.state.O >= 3)) {
        //but I don't need the turns, just the number of x's and o's

        //Step 2
        if (this.state.X === 3 && this.state.O === 3) {

            //console.log("checking if it goes into here")
            //print = "checking if it goes into here";
            //alert(" someString ")

            //If you are X, you can only delte an X, if you are an O, you can only delete an O
            if ((this.state.xIsNext && (squares[i] === "X")) || (!this.state.xIsNext && (squares[i] === "O"))) {
                //alert("Going into the part of deleting");
                this.setState({ deletedPlace: i });
                squares[i] = null;

                //step 5
                //if the player deletes the center piece, it nulls the constructor arguments
                if (i === 4) {

                    if (this.state.xIsNext) {
                        this.setState({ xIsInCenter: null });
                    }
                    else {
                        this.setState({ oIsInCenter: null });
                    }
                }

                this.setState({
                    history: history.concat([
                        {
                            squares: squares
                        }
                    ]),
                    //can't change the X or O as after you delete the X or an O, you have to add an X or an O
                    //xIsNext: !this.state.xIsNext
                });

                //decreasing the number of X's by 1, and having the player click another box
                if (this.state.xIsNext) {
                    this.setState({ X: this.state.X - 1 });
                    //if I handleClick, it would just delete the X, then add it there again, 
                    //so to fix this, I just had to not change the xIsNext vaue
                    //alert("X has gone down by 1");
                }
                //Same as ^, but O
                else {
                    this.setState({ O: this.state.O - 1 });
                    //alert("O has gone down by 1");
                }
            }
        }

        else {

            //if there is something here, just return, checked for winner at begnning
            if (squares[i]) {
                return;
            }

            //step 4
            //for moving the deleted X or O to an empty place that is adjacent vertically, horizontally, or diagonally
            if (this.state.deletedPlace !== null) {
                //alert("At deleted Place Check");
                var whereYouCanPlace = this.possibleLoc(this.state.deletedPlace);
                //alert(whereYouCanPlace);

                //need to learn to spell, I misspelled includes as inclues and was stuck for an hour
                var n = whereYouCanPlace.includes(i);

                if (n === false) {
                    alert("You must move that " + (this.state.xIsNext ? "X" : "O") +
                        " to a place that is adjacent vertically, horizontally, or diagonally");
                    return
                }
            }

            //to keep track of the Number of turns, because after 6, a X or an O must be deleted
            //this.setState({ turns: this.state.turns + 1 });
            //don't need this
            //just need to keep track of number of x's and o's

            //counting the number of X's
            if (this.state.xIsNext) {
                this.setState({ X: this.state.X + 1 });
             }
                //counting the number of O's
             else {
                this.setState({ O: this.state.O + 1 });
            }

            squares[i] = this.state.xIsNext ? "X" : "O";
                this.setState({
                    history: history.concat([
                        {
                            squares: squares
                        }
                    ]),
                    xIsNext: !this.state.xIsNext
                });

            //Step 5
            if ((this.state.xIsNext && this.state.xIsInCenter) || (!this.state.xIsNext && this.state.oIsInCenter)) {

                //for the case when the player just needs to put a piece in the center
                if (calculateWinner(squares)) {
                    return;
                }

                alert("Player: " + (this.state.xIsNext ? "X" : "O") +
                    " has not moved their piece thus violated the center rule and/or lost!"); 

                if (this.state.xIsNext) {
                    this.setState({ oHasWon: true });
                }
                //Same as ^, but O
                else {
                    this.setState({ xHasWon: true });
                }

                return;
            }

            //Step 5
            //marking that the player has clicked on the Center tile 
            if ((this.state.xIsNext && (squares[4] === "X")) || (!this.state.xIsNext && (squares[4] === "O"))) {

                //for the case when the player just needs to put a piece in the center
                if (calculateWinner(squares)) {
                    return;
                }

                alert("Player: " + (this.state.xIsNext ? "X" : "O") +
                    " you must either win or vacate the center square in this next move.");


                if (this.state.xIsNext) {
                    this.setState({ xIsInCenter: true });
                }
                //Same as ^, but O
                else {
                    this.setState({ oIsInCenter: true });
                }

                return;
            }

        }
    }

    render() {

        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        let status;

        //this works, but I want to keep track of the # of x's and o's
        //if (this.state.turns >= 6) {

        //problem where an O must be deleted after 2 O's and not all 3 are placed
        //if ((this.state.X === 3 || this.state.O === 3)) {
        if ((this.state.X === 3 && this.state.O === 3)) {
            if (winner) {
                status = "Winner: " + winner;
            }
            else if (this.state.xHasWon) {
                status = "Winner: Player X";
            }
            else if (this.state.oHasWon) {
                status = "Winner: Player O";
            }
            else {
                //true is X false is O
                status = "Player: " + (this.state.xIsNext ? "X" : "O") + " must delete an " + (this.state.xIsNext ? "X" : "O")
                    + " and move it to an empty square that is adjacent vertically, horizontally, or diagonally";
            }
        }
        else {
            if (winner) {
                status = "Winner: " + winner;
            }
            else if (this.state.xHasWon) {
                status = "Winner: Player X";
            }
            else if (this.state.oHasWon) {
                status = "Winner: Player O";
            }
            else {
                status = "Next player: " + (this.state.xIsNext ? "X" : "O");
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{/*moves*/}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
