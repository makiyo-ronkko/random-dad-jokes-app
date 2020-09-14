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
    // this.state = {
    //   jokes: [],
    // };

    // If no jokes in local storage, get new jokes
    // Otherwise, get jokes(string) from localstorage
    // Parse them into JSON format
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
      loading: false,
    };
    this.handleClick = this.handleClick.bind(this);

    // check if any duplicating text of jokes when loading
    this.seenJokes = new Set(this.state.jokes.map((j) => j.text));
    console.log(this.seenJokes);
  }

  componentDidMount() {
    // if no jokes, then get new jokes
    if (this.state.jokes.length === 0) this.getJokes();
  }
  // to clear localstorage, 'window.localStorage.clear()'

  async getJokes() {
    let jokes = [];
    try {
      //less than 10
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get(BASE_URL, {
          headers: { Accept: 'application/json' }, //default is html ver
        });
        // console.log(res);
        // console.log(res.data.joke)
        // jokes.push(res.data.joke);

        //jokes.push({ text: res.data.joke, votes: 0, id: uuid() }); // set up votes and id here
        // Push to object instead
        // This way we can add id, upvotes and downvotes

        // check dublicating text of jokes
        let newJoke = res.data.joke;
        if (!this.seenJokes.has(newJoke)) {
          // if no duplication, push new jokes
          jokes.push({ text: newJoke, votes: 0, id: uuid() });
        } else {
          console.log('found a dublicate!');
          console.log(newJoke);
        }
      }

      console.log(jokes);

      this.setState(
        // jokes: jokes, // Initiall overwriting new jokes
        (st) => ({
          loading: false,
          // return array of existing state jokes, and add new jokes(newly feched)
          jokes: [...st.jokes, ...jokes],
        }),
        () =>
          // Update new jokes to local storage as a 2nd argument of setState
          window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
      );
      // Store data to window local storage
      // Window local storage only stores string
      // window.localStorage.setItem(
      //   'jokes', // key
      //   JSON.stringify(jokes) // value
      // );
    } catch (e) {
      alert(e);
      this.setState({
        loading: false,
      });
    }
  }

  // delta: positive number either negative number
  handleVote(id, delta) {
    this.setState(
      (st) => ({
        jokes: st.jokes.map((j) =>
          // if id matches, return entire j ojbect and update votes, else return j object into array
          j.id === id ? { ...j, votes: j.votes + delta } : j
        ),
      }),
      () =>
        // Update new votes to local storage as a 2nd argument of setState
        window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  }

  handleClick() {
    // this.getJokes();
    // If loading, call getJokes as callback function
    this.setState({ loading: true }, this.getJokes);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className='JokeList-spinner'>
          <i className='far fa-8x fa-laugh fa-spin' />
          <h1 className='JokeList-title'>Loading....</h1>
        </div>
      );
    }
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
          <button className='JokeList-getmore' onClick={this.handleClick}>
            New Jokes
          </button>
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
