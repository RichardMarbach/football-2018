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
                <Team {...home_team} showGoals={!this.isFuture()} />
                <ScoreBoard {...this.props} gameTime={this.isFuture() ? this.gameTime() : this.props.time} />
                <Team {...away_team} showGoals={!this.isFuture()} />
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
            <div className="events">
                <ol style={{ paddingLeft: '10px', textAlign: 'left' }}>
                    {props.home_team_events.map((event, i) => (
                        <li key={i}>{event.time} {event.type_of_event} {formatPlayerName(event.player)}</li>
                    ))}
                </ol>
            </div>
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
            <div className="events">
                <ol style={{ paddingRight: '10px', textAlign: 'right' }}>
                    {props.away_team_events.map((event, i) => (
                        <li key={i}>{formatPlayerName(event.player)} {event.type_of_event} {event.time}</li>
                    ))}
                </ol>
            </div>
        </div>
    </div>
);

const Team = (props) => (
    <div style={{ backgroundImage: 'url(' + flags[props.code + '.jpg'] + ')' }} className='team'>
        <span className="country-name">
            {props.country} ({props.code})
        </span>
    </div>
);

export default Match;