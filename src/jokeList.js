import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';
import { v4 as uuid } from 'uuid';
import Joke from './Joke';

const BASE_URL = 'https://icanhazdadjoke.com/';
class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
    };
  }

  async componentDidMount() {
    let jokes = [];
    //less than 10
    while (jokes.length < this.props.numJokesToGet) {
      let res = await axios.get(BASE_URL, {
        headers: { Accept: 'application/json' }, //default is html ver
      });
      // console.log(res);
      // console.log(res.data.joke)
      // jokes.push(res.data.joke);
      jokes.push({ text: res.data.joke, votes: 0, id: uuid() });
      // Push to object instead
      // This way we can add id, upvotes and downvotes
    }
    console.log(jokes);
    this.setState({
      jokes: jokes,
    });
  }

  // delta: positive number either negative number
  handleVote(id, delta) {
    this.setState((st) => ({
      jokes: st.jokes.map((j) =>
        // if id matches, return entire j ojbect and update votes, else return j object into array

        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    }));
  }

  render() {
    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'>
            <span>Dad</span> Jokes
          </h1>
          <img
            src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'
            alt=''
          />
          <button className='JokeList-getmore'>New Jokes</button>
        </div>

        <div className='JokeList-jokes'>
          {this.state.jokes.map((j) => (
            <Joke
              key={j.id}
              votes={j.votes}
              text={j.text}
              upvote={() => this.handleVote(j.id, 1)}
              downvote={() => this.handleVote(j.id, -1)}
            />
            //{j} // cannot render object
            // {j.joke} - {j.votes}
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
