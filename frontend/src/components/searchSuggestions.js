/* eslint-disable eqeqeq */
import React from 'react';

const Suggestions = props => {
  if (props.results.length > 0) {
    const options = props.results.map(r => (
      <li
        key={r.medication_id}
        value={r.name}
        data-name={r.name}
        data-code={r.code}
        onClick={e => {
          props.onChangehandler(e);
        }}
      >
        {r.code != '' ? `${r.name}|${r.code}` : `${r.name}`}
      </li>
    ));
    return <ul className="search-suggestions">{options}</ul>;
  } else {
    return '';
  }
};

export default Suggestions;
