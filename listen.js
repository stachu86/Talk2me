navigator.webkitGetUserMedia({
    audio: true,
}, function () {
    console.log("Extension have permission to microphone");
}, function () {
    console.log("Extension can't use microphone");
});

chrome.commands.onCommand.addListener(function (command) {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; //maybe false
    recognition.lang = "pl";
    recognition.maxAlternatives = 1;

    recognition.onerror = function (event) {
        console.log(event.error);

    };
    recognition.onresult = function (event) {
        console.log(event);
        if (typeof(event.results) === 'undefined') {
            recognition.stop();
            return;
        }
        if (event.results[event.results.length - 1].isFinal) { //Final results
            var text = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            console.log("Results: " + text);

            //Simple commands
            switch (text) {
                case Commands.newTab:
                    chrome.tabs.create({url: URLs.google});
                    break;
                case Commands.mail:
                    chrome.tabs.create({url: URLs.mail});
                    break;
                case Commands.facebook:
                    chrome.tabs.create({url: URLs.facebook});
                    break;
            }

            //Search command
            var firstToken = text.split(" ")[0];
            if (firstToken === Commands.search) {
                var question = text.split(" ");
                question[0] = "";
                question = question.join(" ");
                chrome.tabs.create({url: URLs.search + question});
            }
        }
    };

    recognition.onend = function () {
        //TODO check reason for END event.
        console.log("abort");
        recognition.start();
        console.log("starting again");
    };

    recognition.start();

});


