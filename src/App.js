import React, {
  Component
} from 'react';
import './App.css';
import Match from './Match';

const API = 'http://worldcup.sfg.io/matches';
const REFRESH = 60 * 1000;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      matches: {
        yesterday: [],
        today: []
      },
      interval: null
    };
  }

  componentDidMount() {
    let matchData = localStorage.getItem('matches');
    matchData = matchData ? JSON.parse(matchData) : this.state.matches;
    this.fetchData()
    this.setState({
      ...this.state,
      matches: matchData,
      interval: setInterval(() => {
        this.fetchData()
      }, REFRESH)
    })
  }

  getDate(dayOffset = 0) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + dayOffset);
    return date;
  }

  fetchData() {
    fetch(API)
      .then(res => res.json())
      .then(data => data.map(match => { match.datetime = new Date(match.datetime); return match; }))
      .then(matches => matches.reduce((prv, match) => {
        if (match.datetime.getTime() >= this.getDate(-1).getTime() && match.datetime.getTime() <= this.getDate().getTime()) {
          prv.yesterday.push(match)
        } else if (match.datetime.getTime() <= this.getDate(1).getTime() && match.datetime.getTime() >= this.getDate().getTime()) {
          prv.today.push(match)
        }
        return prv;
      }, { yesterday: [], today: [] }))
      .then(data => { localStorage.setItem('matches', JSON.stringify(data)); return data; })
      .then(data => this.setState({
        ...this.state,
        matches: data
      }));
  }

  render() {
    const { matches } = this.state;
    if (!matches.today.length && !matches.yesterday.length) {
      return (<h1>No matches today or yesterday</h1>);
    }

    return (
      <div className="App" >
        <div className="matches">
          <div className="divider">Yesterday</div>
          {matches.yesterday.map((match, i) =>
            <Match key={i} {...match} yesterday={true} />
          )}
        </div>
        <div className="matches">
          <div className="divider">Today</div>
          {matches.today.map((match, i) =>
            <Match key={i} {...match} />
          )}
        </div>
      </div>
    );
  }
}

export default App;