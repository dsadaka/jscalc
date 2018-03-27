import React from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'universal-cookie'

class Calculator extends React.Component {
    constructor() {
        super();
        this.cookieName = this.cookieName
        this.enterDigit = this.enterDigit.bind(this);
        this.enterOperator = this.enterOperator.bind(this);
        this.pushHistory = this.pushHistory.bind(this);
        this.setHistory = this.setHistory.bind(this);
        this.state = {
            input: '',
            output: '',
            history: [],
            operator: null,
            deleteToggle: 'DEL'
        }
        this.setHistory();
        
    }
    enterDigit(value) {
         if(value === '=') {
             if (this.state.input.length > 0) {
                 this.pushHistory(this.state.input + ' = ' + this.state.output);
                 this.setState({
                     input: this.state.output,
                     output: '',
                     operator: null,
                     deleteToggle: 'CLR'
                 })
             }
        } else if (this.state.operator !== null) {
            var newInput = this.state.input + value;
            var replace = newInput.replace(/x/g, '*').replace(/÷/g, '/');
            var result = Math.round(10000000 * eval(replace),5) / 10000000;
            this.setState({
                input: newInput,
                output: result,
                deleteToggle: 'DEL'
            })
        } else {
            this.setState({
                input: this.state.input + value,
                deleteToggle: 'DEL'
            })
        }
    }
    enterOperator(value) {
        this.setState({
            input: this.state.input.toString()
        });
        if(value == 'CLR') {
            this.setState({
                input: '',
                output: '',
                operator: null
            })
        } else if(value == 'DEL') {
            this.setState({
                input: this.state.input.slice(0, -1)
            })
        } else {
            this.setState({
                input: this.state.input + value,
                operator: value.replace(/x/g, '*').replace(/÷/g, '/')
            })

        }
    }
    setHistory() {
        var history  = this.getCookie(this.cookieName)
        if (typeof history != 'undefined') {
            this.state.history = history
        }                
    }
    pushHistory(value) {
        this.setHistory();
        while (this.state.history.length >= 10) {
            this.state.history.shift(1)
        }
        this.state.history.push(value)
        this.setCookie(this.cookieName, this.state.history)
    }
    getCookie(name) {
        const cookies = new Cookies();
        var cookie = cookies.get(name);
        console.log(cookie)

        return cookie
    }
    setCookie(name, value) {
        const cookies = new Cookies();
        this.removeCookie(name);
        cookies.set(name, value)
    }
    removeCookie(name) {
        const cookies = new Cookies();
        cookies.remove(name)
    }
    render() {
        return(
            <div>
                <Display input={this.state.input} output={this.state.output} history={this.state.history}/>
                <CalcInput  enterDigit={this.enterDigit} enterOperator={this.enterOperator} deleteToggle={this.state.deleteToggle} />
            </div>
        )
    }
}
class Display extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="display z-depth-3">
                <div className="history"><History history={this.props.history} /></div>
                <div className="input">{this.props.input.toString()}</div>
                <div className="output">{this.props.output}</div>
            </div>
        )
    }
}
class CalcInput extends React.Component {
    render(props) {
        return(
            <div>
                <KeyPad className="keypad" enterDigit={this.props.enterDigit} />
                <Operators  enterOperator={this.props.enterOperator} deleteToggle={this.props.deleteToggle} />
                <ExtendedOperators enterDigit={this.props.enterDigit} />
            </div>
        )
    }
}

class KeyPad extends React.Component {
    constructor(props) {
        super(props);
    }
    mapKeys(arr) {
        return arr.map(a => <Key key={a.toString()} value={a} enterValue={this.props.enterDigit} />);
    }
    render() {
        let rowOne = [7, 8, 9],
            rowTwo = [4, 5, 6],
            rowThree = [1, 2, 3],
            rowFour = [".", 0, '='];
        return(
            <div className="keypad">
                <div className="keyRow">{this.mapKeys(rowOne)}</div>
                <div className="keyRow">{this.mapKeys(rowTwo)}</div>
                <div className="keyRow">{this.mapKeys(rowThree)}</div>
                <div className="keyRow">{this.mapKeys(rowFour)}</div>

            </div>
        )
    }
}

class History extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            this.props.history.map(h => <HistRow key={h} value={h} />)
        )
    }

}

class HistRow extends React.Component {
    render() {
        const value = this.props.value;
        return(
            <div>
                {value}
                <br></br>
            </div>
        )
        
    }
}

class Key extends React.Component {
    render() {
        const value = this.props.value;
        return(
            <button className="key waves-effect waves-circle waves-light" onClick={this.props.enterValue.bind(this, value)}>{value}</button>
        )
    }
}

class Operators extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className="operators">
                <Key value={this.props.deleteToggle} enterValue={this.props.enterOperator} />
                <Key value='÷' enterValue={this.props.enterOperator} />
                <Key value='x' enterValue={this.props.enterOperator} />
                <Key value='-' enterValue={this.props.enterOperator} />
                <Key value='+' enterValue={this.props.enterOperator} />
            </div>
        )
    }
}
class ExtendedOperators extends React.Component {
    render() {
        return(
            <div className="extendedOperators"></div>
        )
    }
}
ReactDOM.render(<Calculator />, document.getElementById('calculator'));