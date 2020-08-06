import React from 'react';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';

const toggleMachine  =  Machine({
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

function Toggle() {
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

export default Toggle;
