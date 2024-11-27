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
  let transformedWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    let splitWords: string[] = words[i].split(' ').filter(Boolean);
    let transformedWord: string = '';

    for (let j = 0; j < splitWords.length; j++) {
      if (j == splitWords.length - 1) {
        transformedWord += capitalizeFirstLetter(splitWords[j]);
      } else {
        transformedWord += capitalizeFirstLetter(splitWords[j]) + ' '; 
      }
    }

    transformedWords.push(transformedWord);
  }

  return transformedWords.sort((a,b) => a.localeCompare(b));
}

function capitalizeFirstLetter(word: string): string {
  return word.slice(0, 1).toUpperCase() + word.slice(1); 
}

console.log(transformWords(['  nice', 'hey there     ', '   woah       man ']));
console.log(transformWords(['hi']));
console.log(transformWords([]));
console.log(transformWords(['hey', '    hey', 'hey   ']));
console.log(transformWords(['a']));
console.log(transformWords(['I']));