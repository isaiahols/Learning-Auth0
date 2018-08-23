import React, { Component } from 'react';
import './App.css';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }




  async componentDidMount() {
    let userData = await axios.get('/api/user-data');
    this.setState({
      user: userData.data,
    })
  }




  login() {
    console.log('yes, im working');
    let { REACT_APP_DOMAIN, REACT_APP_CLIENT_ID } = process.env;

    let url = `${encodeURIComponent(window.location.origin)}/auth/callback`

    window.location = `https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${url}&response_type=code`


  }

  render() {
    return (
      <div className="App">
        <h1>This is an App that I just made</h1>
        <h1>Also, this is an auth intro</h1>
        <button onClick={() => this.login()} >Login</button>
        <a href='http://localhost:3550/logout'>
          <button>Logout</button>
        </a>
        <hr />
        {JSON.stringify(this.state.user)}
      </div>
    );
  }
}

export default App;
