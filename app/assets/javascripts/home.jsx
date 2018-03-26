class Calculator extends React.Component {
    constructor() {
        super();
        this.enterDigit = this.enterDigit.bind(this);
        this.enterOperator = this.enterOperator.bind(this);
        this.state = {
            input: '',
            output: '',
            operator: null,
            deleteToggle: 'DEL'
        }
    }
    enterDigit(value) {
         if(value === '=') {
            this.setState({
                input: this.state.output,
                output: '',
                operator: null,
                deleteToggle: 'CLR'
            })
        } else if (this.state.operator !== null) {
            var newInput = this.state.input + value;
            var replace = newInput.replace(/x/g, '*').replace(/÷/g, '/');
            var result = eval(replace);
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
    render() {
        return(
            <div>
                <Display input={this.state.input} output={this.state.output} />
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