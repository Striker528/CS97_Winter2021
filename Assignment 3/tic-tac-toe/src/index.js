import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//class Square extends React.Component {
    /*
    constructor(props) {
        //In JavaScript classes, you need to always call super when defining the constructor of a subclass.
        //All React component classes that have a constructor should start with a super(props) call.
        super(props);
        //To remeber things, components use state
        this.state = {
            value: null,
        };
    }
*/
    /*
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}
*/

/*In React, function components are a simpler way to write components that only contain a render method and don’t have their own state. 
 * Instead of defining a class which extends React.Component, we can write a function that takes props as input and returns what should be rendered. 
 * Function components are less tedious to write than classes, and many components can be expressed this way.*/
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/*To collect data from multiple children, or to have two child components communicate with each other, 
 * you need to declare the shared state in their parent component instead. 
 * The parent component can pass the state back down to the children by using props; 
 * this keeps the child components in sync with each other and with the parent component.*/

class Board extends React.Component {
    //Add a constructor to the Board and set the Board’s initial state to contain an array of 9 nulls corresponding to the 9 squares:
    /*
    constructor(props) {
        super(props)
        this.state = {
            squares: Array(9).fill(null),
            //We’ll set the first move to be “X” by default.
            xIsNext: true,
        };
    }
    */

    /*
    handleClick(i) {
         //call .slice() to create a copy of the squares array to modify instead of modifying the existing array.
         //* Immutability
        // * 2 approaches to changing data
         //*  1st: mutate the data by direclty changing the data's values
         //*  2nd: repalce teh data with a new copy which has the desired effect
         //* by not mutating (or changing the underlying data) directly, we gain several benefits
         //*  Complex features become simple
         //*  Detecting Changes
         //*  Determing when to re-render in react
        const squares = this.state.squares.slice();

        //We can now change the Board’s handleClick function to return early by ignoring a click 
         //* if someone has won the game or if a Square is already filled:
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        //Each time a player moves, xIsNext (a boolean) will be flipped to determine which player goes next and the game’s state will be saved. 
         //* We’ll update the Board’s handleClick function to flip the value of xIsNext:
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }
*/

    /*We will now use the prop passing mechanism again. 
     * We will modify the Board to instruct each individual Square about its current value('X', 'O', or null).
     * We have already defined the squares array in the Board’s constructor, and we will modify the Board’s renderSquare method to read from it:*/
    renderSquare(i) {
        return (
            <Square
                //value={this.state.squares[i]}
                /*we need to change what happens when a Square is clicked. 
                 * The Board component now maintains which squares are filled. 
                 * We need to create a way for the Square to update the Board’s state. 
                 * Since state is considered to be private to a component that defines it, we cannot update the Board’s state directly from Square.
                 * Instead, we’ll pass down a function from the Board to the Square, 
                 * and we’ll have Square call that function when a square is clicked. 
                 * We’ll change the renderSquare method in Board to:*/
            //onClick={() => this.handleClick(i)}

                /*pass the location of each Square into the onClick handler to indicate which Square was clicked.*/
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        //change the “status” text in Board’s render so that it displays which player has the next turn:
        //const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');


        /*We will call calculateWinner(squares) in the Board’s render function to check if a player has won. 
         * If a player has won, we can display text such as “Winner: X” or “Winner: O”. 
         * We’ll replace the status declaration in Board’s render function with this code: */
        /*
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        //Since the Game component is now rendering the game’s status
        */

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
    /*set up the initial state for the Game component within its constructor*/
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    /*update the Game component’s render function to use the most recent history entry to determine and display the game’s status*/
    render() {
        const history = this.state.history;
        //rendering the currently selected move according to stepNumber
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        //map over the history in the Game’s render method
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                //adding key for each of the moves
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    // we need to move the handleClick method from the Board component to the Game component.
    handleClick(i) {
        // This ensures that if we “go back in time” and then make a new move from that point, 
        //we throw away all the “future” history that would now become incorrect.
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            //After we make a new move, we need to update stepNumber by adding stepNumber: history.length
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    //define the jumpTo method in Game to update that stepNumber
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
