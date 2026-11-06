const fieldOptionsData = {
  a: ['a', 'b', 'oldProperty'],
  b: ['c', 'anotherOldProperty', 'd'],
  c: ['yetAnotherOldProperty', 'e', 'f'],
};

const flattenedBeforeData = {
  a: 'oldProperty',
  b: 'anotherOldProperty',
  c: 'yetAnotherOldProperty',
};

const flattenedAfterData = {
  a: 'newProperty',
  b: 'anotherNewProperty',
  c: 'lastNewProperty',
};

for (const [key, value] of Object.entries(flattenedBeforeData)) {
  if (!fieldOptionsData[key]) {
    continue;
  }

  for (const element of fieldOptionsData[key]) {
    if (value === element) {
      const indexOfIdenticalElement = fieldOptionsData[key].findIndex(element => element === value);

      fieldOptionsData[key][indexOfIdenticalElement] = flattenedAfterData[key];
    }
  }
}

console.log('fieldOptionsData: ', fieldOptionsData);

