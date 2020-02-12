import * as assert from 'assert';
import * as R from 'ramda';

type Address = {
  street: string;
  zip: number;
};

type Person = {
  id: string;
  name: string;
  address: Address;
};

type People = { [id: string]: Person };

type State = {
  people: People;
};

type PartialPeople = { [id: string]: Person | null };

type PartialState = {
  people: PartialPeople;
};

function mergeState(state: State, payload: PartialState) {
  const newState: State = R.mergeDeepRight(state, payload);
  return R.equals(state, newState) ? state : newState;
}

const initialState: State = {
  people: {
    '1': {
      id: '1',
      name: 'Lars',
      address: {
        street: 'Hovedgaden',
        zip: 3460,
      },
    },
  },
};

const addPerson: PartialState = {
  people: {
    '2': {
      id: '2',
      name: 'Hanne',
      address: {
        street: 'Køgemestervej',
        zip: 3400,
      },
    },
  },
};

const updatePerson: PartialState = {
  people: {
    '2': {
      id: '2',
      name: 'Jens',
      address: {
        street: 'Køgemestervej',
        zip: 3400,
      },
    },
  },
};

const deletePerson: PartialState = {
  people: {
    '2': null,
  },
};

const state = mergeState(initialState, addPerson);

// State is unchanged when adding same person again
assert.equal(mergeState(state, addPerson), state);

// State is changed when updating name of one person
assert.notEqual(mergeState(state, updatePerson), state);
assert.equal(mergeState(state, updatePerson).people['2'].name, 'Jens');

// Substate of other people unchanged when updating person
assert.equal(mergeState(state, updatePerson).people['1'], state.people['1']);

// Id of deleted people are not removed
assert.ok(
  R.equals(mergeState(state, deletePerson), {
    people: {
      '1': {
        id: '1',
        name: 'Lars',
        address: {
          street: 'Hovedgaden',
          zip: 3460,
        },
      },
      '2': null,
    },
  })
);
console.log('done');
