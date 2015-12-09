var movieQuotes = [
    "All those moments will be lost in time",
    "A boy's best friend is his mother",
    "Daddy! My Daddy",
    "ET phone home",
    "Frankly, my dear, I don't give a damn",
    "Get busy living, or get busy dying",
    "Go ahead, make my day",
    "Here's another nice mess you've gotten me into",
    "Here's looking at you, kid",
    "He's not the Messiah. He's a very naughty boy",
    "I am Spartacus",
    "I ate his liver with some fava beans and a nice chianti",
    "I see dead people",
    "I want to be alone",
    "I'll be back",
    "I'll have what she's having",
    "It was beauty killed the beast",
    "It's not murder, it's ketchup",
    "Man who catch fly with chopstick accomplish anything",
    "Life is a box of chocolates",
    "Oh my gosh, look at that fluffy unicorn",
    "Rosebud",
    "To infinity and beyond",
    "What did you expect, an exploding pen?",
    "Why so serious?",
    "You talkin' to me?",
    "You're gonna need a bigger boat"
];

// Might be good to use these for possible final points
var pangrams = [
    "Amazingly few discotheques provide jukeboxes",
    "Heavy boxes perform quick waltzes and jigs",
    "Jinxed wizards pluck ivy from the big quilt",
    "The quick brown fox jumps over a lazy dog",
    "Pack my box with five dozen liquor jugs",
    "Jackdaws love my big sphinx of quartz",
    "The five boxing wizards jump quickly",
    "How quickly daft jumping zebras vex"
];

function pickSentence() {
    var index = Math.floor(Math.random() * movieQuotes.length);
    return movieQuotes[index];
}

module.exports.get = pickSentence;
