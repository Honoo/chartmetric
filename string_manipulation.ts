/*

Write a function which accepts an array of 
strings and returns an array of strings,
where each string element:
    • Has no leading or trailing space
    • Has only one space in between words
    • Has All Words In Title Case Like This
    • Final array is sorted in ascending order

Examples:

> f(['  nice', 'hey there     ', '   woah       man '])
[ 'Hey There', 'Nice', 'Woah Man' ]

> f(['hi'])
[ 'Hi' ]

> f([])
[]

> f(['hey', '    hey', 'hey   '])
[ 'Hey', 'Hey', 'Hey' ]

*/

function transformWords(words: string[]): string[] {
  const transformedWords = words.map((word: string) => {
    const splitWord = word.split(' ').filter(Boolean);

    const transformedWord = splitWord.map((wordSection: string, index: number) => {
      if (index === splitWord.length - 1) {
        return `${capitalizeFirstLetter(wordSection)}`;
      } else {
        return `${capitalizeFirstLetter(wordSection)} `;
      }
    });

    return transformedWord.reduce((accumulator, currentValue) => `${accumulator}${currentValue}`);
  });

  return transformedWords.sort((a,b) => a.localeCompare(b));
}

function capitalizeFirstLetter(word: string): string {
  return `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`; 
}

console.log(transformWords(['  nice', 'hey there     ', '   woah       man ']));
console.log(transformWords(['hi']));
console.log(transformWords([]));
console.log(transformWords(['hey', '    hey', 'hey   ']));
console.log(transformWords(['a']));
console.log(transformWords(['I']));
console.log(transformWords(['    I like tea       ']));