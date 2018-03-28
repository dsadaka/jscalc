import React from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'universal-cookie'

class Calculator extends React.Component {
    constructor() {
        super();
        this.cookieName     = '_jscalc_history';
        this.op1            = null;                         // left operand
        this.op2            = null;                         // right operand
        this.operator       = null                          // current operator
        this.arrOutput      = [];
        this.enterDigit     = this.enterDigit.bind(this);
        this.enterOperator  = this.enterOperator.bind(this);
        this.pushHistory    = this.pushHistory.bind(this);
        this.getHistory     = this.getHistory.bind(this);
        this.appendOperatorToOutput     = this.appendOperatorToOutput.bind(this);
        this.calcSimpleResult = this.calcSimpleResult.bind(this);
        this.state = {
            input: '',
            output: '',
            history: [],
            operator: null,
            deleteToggle: 'DEL'
        }
        this.getHistory();

    }
    enterDigit(value) {
        if(value === '=') {
            if (this.state.input.length > 0) {
                this.pushHistory(this.state.input + ' = ' + this.state.output);
                this.setState({
                    input: this.state.output.toString(),
                    output: '',
                    operator: null,
                    deleteToggle: 'CLR'
                })
            }
        } else if (this.state.operator !== null) {
            var newInput = this.state.input + value;
            var replace = newInput.replace(/x/g, '*').replace(/÷/g, '/').replace(/√x/, '**');
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
        if (this.op2 || this.op1) {
            if (!this.op2) {
                this.appendOperatorToOutput(value);

            // We have both operands and an operator
            } else {
                this.op1 = this.calcResult();
                this.state.input = this.op1;
                this.arrOutput.push(this.op2, value);
                this.op2 = null
            }
            if (value === '=') {
                this.pushHistory(this.arrOutput.join(' ') + ' = ' + this.op1);
                this.arrOutput = [];
                this.op2 = null;
                this.operator = null
            } else {
                this.operator = value
            }

            this.setState({
                input: this.state.input,
                operator: this.operator,
                output: this.arrOutput.join(' '),
                deleteToggle: 'CLR'
            })

        }
    }

    enterSpecialOperator(value) {
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
        } else if(value == 'CA') {
            this.clearHistory();
            this.setState({
                input: '',
                output: '',
                operator: null,
            })
        } else if(value == 'SQRT') {
            if (this.op2 || this.op1) {
                var result;
                var oper;
                if (!this.op2) {
                    oper = this.op1;
                    this.op1 = this.round(Math.pow(oper, 0.5))
                    this.state.input = this.op1
                } else {
                    oper = this.op2;
                    this.op2 = this.round(Math.pow(oper, 0.5))
                    this.state.input = this.op2
                }
                this.pushOutput('√(' + oper + ')')

                this.setState({
                    output: this.arrOutput.join(' '),
                    operator: null,
                    deleteToggle: 'CLR'
                })

            }
        }
    }

    // appendOperatorToOutput - adds the current operator to the output array
    //                   unless an operator already there
    appendOperatorToOutput(value) {
        if (isNaN(this.arrOutput.slice(-1).pop())) {
            this.replaceLast(this.arrOutput, value)
        } else {
            this.arrOutput.push(value)
        }
    }

    calcResult() {
        var result;
        if (this.operator == '**') {
            result = this.round(Math.pow(this.op1, this.op2))
        } else {
            result = calcSimpleResult()
        }
        return result
    }

    // calcSimpleResult - when eval alone will do the job
    calcSimpleResult() {
        var oper = this.operator.replace(/x/g, '*').replace(/÷/g, '/');
        return this.round(eval(this.op1.toString() + oper + this.op2.toString()))
    }
    getHistory() {
        var history  = this.getCookie(this.cookieName)
        if (typeof history != 'undefined') {
            this.state.history = history
        }
    }
    clearHistory() {
        this.removeCookie(this.cookieName);
        this.setState({
            history: []
        })
    }
    pushOutput(value) {
        this.arrOutput.push(value)
    }
    pushHistory(value) {
        this.getHistory();
        while (this.state.history.length >= 10) this.state.history.shift(1);
        this.state.history.push(value);
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
    replaceLast(arr, newValue) {
        arr.splice(-1, 1, newValue)
    }
    round(expr) {
        return Math.round(10000000 * expr,5) / 10000000
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
                <FnKeys className="keypad fnkey" enterOperator={this.props.enterOperator} deleteToggle={this.props.deleteToggle} />
                <KeyPad className="keypad" enterDigit={this.props.enterDigit} />
                <Operators  enterOperator={this.props.enterOperator} deleteToggle={this.props.deleteToggle} />
                <ExtendedOperators enterDigit={this.props.enterDigit} />

            </div>
        )
    }
}

class FnKeys extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className="fnkey">
                <div className="keyrow">
                    <Key value={this.props.deleteToggle} enterValue={this.props.enterSpecialOperator} />
                    <Key value='CA' enterValue={this.props.enterSpecialOperator} />
                    <Key value=' ' disp="&nbsp;" enterValue={Function.prototype} />
                    <Key value='SQRT' disp="<b>√</b>x" enterValue={this.props.enterSpecialOperator} />
                    <div className="fnkey-filler">&nbsp;</div>
                </div>
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
        const disp = typeof this.props.disp == 'undefined' ? this.props.value : this.props.disp
        return(
            <button className="key waves-effect waves-circle waves-light" value={value} onClick={this.props.enterValue.bind(this, value)}>
                <RawHTML str={disp} /></button>
        )
    }
}

class RawHTML extends React.Component {
    constructor() {
        super();
    }

    rawMarkup(str) {
        return { __html: str };
    }
    render() {
        const str = this.props.str;
        return(
            <span dangerouslySetInnerHTML={this.rawMarkup(str)} />
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
                <Key value='**' disp='x<i>y</i>' enterValue={this.props.enterOperator} />
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