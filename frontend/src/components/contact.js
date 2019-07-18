import React from 'react';

class Contact extends React.Component {
  onSubmit = () => {
    this.props.history.push('/');
  };
  render() {
    return (
      <div>
        <div class="container">
          <form>
            <input placeholder="name" type="name" />
            <input placeholder="email" type="email" />
            <button onClick={this.onSubmit}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Contact;
