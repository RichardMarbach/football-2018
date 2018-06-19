import React, {
    Component
} from 'react';
import './Match.css';
import winnerIcon from './icons/winner.png';

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

    isWinner(code) {
        return this.props.winner_code === code;
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
                <HomeTeam {...home_team} winner={this.isWinner(home_team.code)} />
                <ScoreBoard {...this.props} gameTime={this.isFuture() ? this.gameTime() : this.props.time} />
                <AwayTeam {...away_team} winner={this.isWinner(away_team.code)} />
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

function checkOverflow(el) {
    var curOverflow = el.style.overflow;

    if (!curOverflow || curOverflow === "visible")
        el.style.overflow = "hidden";

    var isOverflowing = el.clientWidth < el.scrollWidth
        || el.clientHeight < el.scrollHeight;

    el.style.overflow = curOverflow;

    return isOverflowing;
}

class Events extends Component {

    constructor(props) {
        super(props);

        this.state = {
            scrolling: false
        }
    }

    componentDidUpdate() {
        if (this.container && !this.state.scrolling) {
            this.scrollContainer();
        }
    }

    scrollContainer() {
        if (checkOverflow(this.container)) {
            this.setState({...this.state, scrolling: true});
            this.scrollToBottom()
        }
    }

    scrollToBottom() {
        if (this.container) {
            this.animateScroll(15000)
        }
    }

    animateScroll(duration) {
        if (!this.container) return
        const self = this;

        const start = 0;
        const end = this.container.scrollHeight;
        const change = end - start;
        const increment = 10;

        function easeInOut(currentTime, start, change, duration) {
            currentTime /= duration / 2;
            if (currentTime < 1) {
                return change / 2 * currentTime * currentTime + start;
            }
            currentTime -= 1;
            return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
        }

        function animate(elapsedTime) {
            elapsedTime += increment;
            const position = easeInOut(elapsedTime, start, change, duration);
            self.container.scrollTop = position;

            if (elapsedTime <= duration) {
                setTimeout(() => animate(elapsedTime), increment);
            } else {
                setTimeout(() => {
                    self.container.scrollTop = start;
                    setTimeout(() => animate(0), 2500)
                }, 5000);
            }
        }

        animate(0);
    }

    render() {
        const props = this.props;

        return (
            <div style={{ maxHeight: '100%', overflow: 'hidden' }} ref={c => this.container = c}>
                <div className="events events-list">
                    <ol style={{ paddingLeft: '10px', textAlign: 'left' }}>
                        {props.events.map((event, i) => (
                            <li key={i}>{event.time} <EventIcon type={event.type_of_event} /> {formatPlayerName(event.player)} </li>
                        ))}
                    </ol>
                </div>
            </div>
        );
    }
}

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
            <div className="flag-region">
                {!props.winner ? null : <img className="winner-icon" src={winnerIcon} alt="winner" />}
                <img className="team-flag" src={flags[props.code + '.jpg']} alt={props.code} />
            </div>
            {props.country}
        </span>
    </div>
);

const HomeTeam = (props) => (
    <div className='team team-home'>
        <span className="country-name">
            {props.country}
            <div className="flag-region">
                {!props.winner ? null : <img className="winner-icon winner-icon-home" src={winnerIcon} alt="winner" />}
                <img className="team-flag" src={flags[props.code + '.jpg']} alt={props.code} />
            </div>
        </span>
    </div>
);

export default Match;