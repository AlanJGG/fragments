const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
} = require('../../src/model/data/memory');

describe('Memory Database', () => {
  const ownerId = 'test-user-memory';
  const id = 'test-fragment-memory';

  test('writeFragment() and readFragment() work', async () => {
    const fragment = {
      id,
      ownerId,
      type: 'text/plain',
      size: 0,
    };

    await writeFragment(fragment);

    const result = await readFragment(ownerId, id);

    expect(result).toEqual(fragment);
  });

  test('readFragment() returns undefined for a missing fragment', async () => {
    const result = await readFragment(ownerId, 'missing-id');

    expect(result).toBeUndefined();
  });

  test('writeFragmentData() and readFragmentData() work', async () => {
    const data = Buffer.from('Hello World');

    await writeFragmentData(ownerId, id, data);

    const result = await readFragmentData(ownerId, id);

    expect(result).toEqual(data);
  });

  test('readFragmentData() returns undefined for missing data', async () => {
    const result = await readFragmentData(ownerId, 'missing-data');

    expect(result).toBeUndefined();
  });
});
