import React from 'react';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import './App.css';

const toggleMachine = Machine({
  id: "toggleMachine",
  initial: "inactive",
  states: {
    inactive: {
      on: {
        TOGGLE: "active"
      }
    },
    active: {
      on: {
        TOGGLE: "inactive"
      }
    }
  }
});

function App() {
  const [current, send] = useMachine(toggleMachine);

  return (
    <div className="App">
      <div>
        {current.matches('active') && <span>We are active!</span>}
        {current.matches('inactive') && <span>We are inactive!</span>}
      </div>
      <button onClick={() => send('TOGGLE')}>Toggle</button>
    </div>
  );
}

export default App;
