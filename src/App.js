import React, {
  Component
} from 'react';
import './App.css';
import Match from './Match';

const API = 'http://worldcup.sfg.io/matches/today';
const REFRESH = 60 * 1000;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      matches: [],
      interval: null
    };
  }

  componentDidMount() {
    let matchData = localStorage.getItem('matchData');
    matchData = matchData ? JSON.parse(matchData) : []
    this.fetchData()
    this.setState({
      ...this.state,
      matches: matchData,
      interval: setInterval(() => {
        this.fetchData()
      }, REFRESH)
    })
  }

  fetchData() {
    fetch(API)
      .then(res => res.json())
      .then(data => { localStorage.setItem('matchData', JSON.stringify(data)); return data; })
      .then(data => this.setState({
        ...this.state,
        matches: data
      }));
  }

  render() {
    const { matches } = this.state;
    if (!matches.length) {
      return (<h1>No matches today</h1>);
    }

    return (
      <div className="App" >
        {matches.map((match, i) =>
          <Match key={i} {...match} />
        )}
      </div>
    );
  }
}

export default App;