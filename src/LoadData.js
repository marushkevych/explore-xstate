import React from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const allData = new Array(25).fill(0).map((_, i) => i + 1);

const perPage = 10;

const dataMachine = Machine({
  id: 'dataMachine',
  initial: 'loading',
  context: {
    data: []
  },
  states: {
    loading: {
      invoke: {
        // Invoke a service when transition to this state. It can invoke a nested state machine, a promise or a callback.
        // This is a "callback"
        id: 'dataLoader',
        src: (context, event) => {
          return (callback, onReceive) => {
            console.log('dataLoader service invoked with event', event);
            console.log('context', context);
            setTimeout(() => {
              const { data } = context;
              const newData = allData.slice(data.length, data.length + perPage);
              const hasMore = newData.length === perPage;

              if (hasMore) {
                callback({type: 'DONE_MORE', newData});
              }
              else {
                callback({type: 'DONE_COMPLETE', newData});
              }
            }, 1000);
          }
        }
      },
      on: {
        DONE_MORE: {
          target: 'more',
          actions: assign({
            data: ({ data }, event) => {
              console.log('loading state received DONE_MORE event', event);
              const { newData = [] } = event;
              return [...data, ...newData]
            }
          })
        },
        DONE_COMPLETE: {
          target: 'complete',
          actions: assign({
            data: ({ data }, { newData = [] }) => [...data, ...newData]
          })
        },
        FAIL: 'failure'
      }
    },
    more: {
      on: {
        LOAD: 'loading'
      }
    },
    complete: {
      type: 'final'
    },
    failure: {
      type: 'final'
    }
  }
})

function LoadData() {
  const [current, send] = useMachine(dataMachine);
  const { data } = current.context;

  return (
      <ul>
        {data.map(row => <li key={row} style={{background: "orange"}}>{row}</li>)}

        {current.matches('loading') && <li>Loading...</li>}

        {current.matches('more') &&
          <li style={{background: "green"}}>
            <button onClick={() => send('LOAD')}>Load more</button>
          </li>
        }
      </ul>
  );
}

export default LoadData;
