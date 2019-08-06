import React from 'react';
import Patients from './Patients';

class App extends React.Component {
  render() {
    return <Patients patients={this.state.patients} />;
  }

  state = {
    patients: [],
  };

  componentDidMount() {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => {
        this.setState({ patients: data.recordset });
      })
      .catch(e => {
        console.log(e);
        return e;
      });
  }
}

export default App;
