// Loop through every word in the word bank
// For every word, check to see if every letter of that word exists in the player's letters. If it does, add that word to the list of matches
// Try every letter that isn't an asterisk first. If the letter in the word isn't one of the normal letters in the player's letters, use the asterisk as the matched letter
// If there are no wilds (asterisks), as soon as one of the letters in the word does not exist in the player's letters, stop and move on to the next word.
// Get the length of the word. Compare the length to the number of player letters. If the word is too long, stop and test the next word.

document.getElementById('player-letters-btn').addEventListener('click', function() {

    var playerLetters = Array.from(document.getElementById('player-letters').value.toLowerCase().replace(/\s/g,''));

    var playerLettersFiltered = playerLetters.filter(function(character) {
        return character !== '*';
    });

    var numberOfWilds = playerLetters.reduce(function(accumulator, character) {
        if (character === '*') {
            accumulator = accumulator + 1;
        }
        return accumulator;
    }, 0);

    var matches = wordBank.reduce(findMatches(playerLettersFiltered, numberOfWilds), []);
    //console.log(matches);
    getPointValueForEachMatch(matches);

}, false);

function findMatches(playerLetters, numberOfWilds) {
    // reduce callback function...
    return function(matches, word) {

        var wordLetters = Array.from(word),
        wordLettersLength = wordLetters.length,
        wordLetter = '',
        playerLettersCopy = [...playerLetters],
        numberOfWildsCopy = numberOfWilds,
        numberOfMatchedLetters = 0,
        wildCharacters = [],
        matchedWordsObject = {};

        // using a 'for' loop instead of a 'forEach' so we can break with a 'return' based on conditions
        for(var i = 0; i < wordLettersLength; i++) {

            wordLetter = wordLetters[i];

            if (playerLettersCopy.length + numberOfMatchedLetters + numberOfWildsCopy >= wordLettersLength) {
                if (playerLettersCopy.includes(wordLetter)) {
                    // Letter exists. Remove letter from player letters and add to matched letters so it can't be compared again
                    playerLettersCopy.splice(playerLettersCopy.indexOf(wordLetter), 1);
                    numberOfMatchedLetters++;
                } else if (numberOfWildsCopy > 0) {
                    // letter does NOT exist, but we have a wild we can use for this letter of the word
                    numberOfWildsCopy--;
                    wildCharacters.push(wordLetter);
                    numberOfMatchedLetters++;
                } else {
                    // letter does NOT exist, and no wilds, move on to next word
                    return matches;
                }
            } else {
                // not enough player letters, move on to next word
                return matches;
            }
        
        }

        matchedWordsObject.word = word;
        matchedWordsObject.wilds = wildCharacters;
        matches.push(matchedWordsObject);
        return matches;

    };
}

function highlightWilds(word, wilds) {

    var arrayOfWordCharacters = Array.from(word),
        wildsCopy = [...wilds];

    if (wildsCopy.length) {
        arrayOfWordCharacters.forEach(function(character, index) {
            if (wildsCopy.includes(character)) {
                wildsCopy.splice(wildsCopy.indexOf(character), 1);
                arrayOfWordCharacters[index] = '<span class="wild-character">' + character + '</span>';
            }
        });
        return arrayOfWordCharacters.join('');
    } else {
        return word;
    }
}

function outputMatches(matches) {

    var wordListOfMatches = document.getElementById('word-list'),
        matchesTableBefore = '<table><caption>Matches</caption><tr><th scope="col">Word</th><th scope="col">Value</th></tr>',
        matchesTableAfter = '</table>',
        matchesSorted = [...matches];

    matchesSorted.sort(function(a, b) {
        return b.value - a.value;
    });

    var matchesOutput = matchesSorted.reduce(function(accumulator, matchObject) {
        return accumulator + '<tr><td>' + highlightWilds(matchObject.word, matchObject.wilds) + '</td><td>' + matchObject.value + '</td></tr>';
    }, '');

    wordListOfMatches.innerHTML = matchesTableBefore + matchesOutput + matchesTableAfter;
}

function getPointValueForEachMatch(matches) {

    var letterValues = {
        "a": 1,
        "b": 3,
        "c": 3,
        "d": 2,
        "e": 1,
        "f": 4,
        "g": 2,
        "h": 4,
        "i": 1,
        "j": 8,
        "k": 5,
        "l": 1,
        "m": 3,
        "n": 1,
        "o": 1,
        "p": 3,
        "q": 10,
        "r": 1,
        "s": 1,
        "t": 1,
        "u": 1,
        "v": 4,
        "w": 4,
        "x": 8,
        "y": 4,
        "z": 10
    };

    matches.forEach(function(matchObject) {

        var wildsCopy = [...matchObject.wilds];

        var pointValue = Array.from(matchObject.word)
        .filter(function(letter) {
            // exclude wilds
            if (wildsCopy.includes(letter)) {
                wildsCopy.splice(wildsCopy.indexOf(letter), 1);
            } else {
                return true;
            }
        })
        .map(function(letter) {
            return letterValues[letter];
        })
        .reduce(function(accumulator, currentValue) {
            return accumulator + currentValue;
        }, 0);
        
        matchObject.value = pointValue;
    });
    outputMatches(matches);
}