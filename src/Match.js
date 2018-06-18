import React, {
    Component
} from 'react';
import './Match.css';


function importAll(r) {
    let images = {};
    r.keys().forEach(item => { images[item.replace('./', '')] = r(item); });
    return images;
}
const flags = importAll(require.context('./flags', false, /\.(png|jpe?g|svg)$/));
const icons = importAll(require.context('./icons', false, /\.(png|jpe?g|svg)$/))

class Match extends Component {
    isCompleted() {
        return this.props.status === 'completed';
    }

    isFuture() {
        return this.props.status === 'future';
    }

    gameTime() {
        const date = new Date(this.props.datetime);
        const localeSpecificTime = date.toLocaleTimeString(navigator.language, {
            hour: '2-digit', minute: '2-digit',
            hour12: false
        });
        return localeSpecificTime;
    }

    render() {
        const { home_team, away_team } = this.props

        return (
            <div className={"match"}>
                <HomeTeam {...home_team} showGoals={!this.isFuture()} />
                <ScoreBoard {...this.props} gameTime={this.isFuture() ? this.gameTime() : this.props.time} />
                <AwayTeam {...away_team} showGoals={!this.isFuture()} />
            </div>
        )
    }
}

function formatPlayerName(name) {
    const splitName = name.split(' ')
    splitName[0] = splitName[0][0] + '.'
    return splitName.join(' ')
}

const ScoreBoard = (props) => (
    <div className="scoreboard">
        <div className="events">
            <Events events={props.home_team_events} />
            <div className={"score" + (props.home_team.code === props.winner_code ? ' winner' : '')}>
                {props.home_team.goals}
            </div>
        </div>
        <div className="playTime">
            <div>
                {props.gameTime}
            </div>
            <div>
                {props.winner_code}
            </div>
        </div>
        <div className="events events-away">
            <div className={"score" + (props.away_team.code === props.winner_code ? ' winner' : '')}>
                {props.away_team.goals}
            </div>
            <Events events={props.away_team_events} />
        </div>
    </div>
);

const Events = (props) => (
    <div className="events">
        <ol style={{ paddingLeft: '10px', textAlign: 'left' }}>
            {props.events.map((event, i) => (
                <li key={i}>{event.time} <EventIcon type={event.type_of_event} /> {formatPlayerName(event.player)} </li>
            ))}
        </ol>
    </div>
);

const EventIcon = (props) => {
    switch (props.type) {
        case 'goal':
            return <img className="event-icon" src={icons['goal.png']} alt={props.type} />
        case 'red-card':
        case 'yellow-card':
            return <img className="event-icon card-icon" src={icons[props.type + '.svg']} alt={props.type} />
        case 'substitution-in':
        case 'substitution-out':
        case 'goal-penalty':
            return <img className="event-icon" src={icons[props.type + '.svg']} alt={props.type} />
        default:
            return props.type
    }
};

const AwayTeam = (props) => (
    <div className='team team-away'>
        <span className="country-name">
            <img className="team-flag" src={flags[props.code + '.jpg']} alt={props.code} />
            {props.country}
        </span>
    </div>
);

const HomeTeam = (props) => (
    <div className='team team-home'>
        <span className="country-name">
            {props.country}
            <img className="team-flag" src={flags[props.code + '.jpg']} alt={props.code} />
        </span>
    </div>
);

export default Match;