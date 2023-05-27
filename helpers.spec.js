const {
  flattenArr,
  dataFetcher,
  sortList,
  formatCurrency,
  handlePromises
} = require('./helpers.js');
const axios = require('axios');

jest.mock('axios');

describe('flattenArr', () => {
  it('flattens a nested array', () => {
    const input = [1, 2, 3, [4, 5, [6, 7, [8, 9, 10]]]];
    const expectedOutput = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(flattenArr(input)).toEqual(expectedOutput);
    expect(flattenArr(input)).toHaveLength(10);
  });

  it('returns a non-nested array', () => {
    const input = [1, 2, 3, 4, 5];
    expect(flattenArr(input)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('dataFetcher', () => {
  it('handles a successful response', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: { users: [] } }));

    const data = await dataFetcher();

    expect(data).toEqual({ data: { users: [] } });
  });

  it('handles an error response', async () => {
    axios.get.mockImplementation(() => Promise.reject('Boom'));

    try {
      await dataFetcher();
    } catch (e) {
      expect(e).toEqual(new Error({ error: 'Boom', message: 'An Error Occurred' }));
    }
  });
});

describe('sortList', () => {
  it('calls a sorter function if it is available', () => {
    const sortFn = jest.fn();

    sortList([3, 2, 1], sortFn);

    expect(sortFn).toBeCalled();
    expect(sortFn).toBeCalledTimes(1);
    expect(sortFn.mock.calls).toEqual([[[3, 2, 1]]]);
  });

  it('does not call a sorter function if the array has a length <= 1', () => {
    const sortFn = jest.fn();

    sortList([1], sortFn);

    expect(sortFn).not.toBeCalled();
    expect(sortFn).toBeCalledTimes(0);
  });
});

// /**
//  * Add you test/s here and get this helper file to 100% test coverage!!!
//  * You can check that your coverage meets 100% by running `npm run test:coverage`
//  */

describe('formatCurrency', () => {
  it('returns $0.00 if input was not a number', () => {
    const input = 'abc';
    expect(formatCurrency(input)).toEqual('$0.00');
  });

  it('returns a number input formatted to US dollars', () => {
    const input = 23;
    expect(formatCurrency(input)).toEqual('$23.00');
  });
});

describe('handlePromises', () => {
  it('resolves all promises', async () => {
    const promise1 = new Promise((res, rej) => {
      return res('Hello');
    });

    const promise2 = new Promise((res, rej) => {
      return res('World');
    });
    const data = await handlePromises([promise1, promise2]);
    expect(data).toEqual(['Hello', 'World']);
  });

  it('handles rejected promises', async () => {
    const promise1 = new Promise((res, rej) => {
      return rej('Error');
    });

    const promise2 = new Promise((res, rej) => {
      return res('World');
    });

    const data = await handlePromises([promise1, promise2]);
    expect(data).toEqual(new Error('Error'));
  });
});
