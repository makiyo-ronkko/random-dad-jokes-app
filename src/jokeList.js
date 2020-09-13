import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';

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
      jokes.push(res.data.joke);
    }
    console.log(jokes);
    this.setState({
      jokes: jokes,
    });
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
          {this.state.jokes.map((joke) => (
            <div>{joke}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
