import React, { Component } from 'react';
import axios from 'axios';

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
        <h1>Dad jokes</h1>
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
