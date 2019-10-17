'use strict';

require('dotenv').config();

const https = require('https');
const Workouts = require('./workoutSheet')

class Bot {
    /**
     * Called when the bot receives a message.
     *
     * @static
     * @param {Object} message The message data incoming from GroupMe
     * @return {string}
     */
    static checkMessage(message) {
        const messageText = message.text;

        // Learn about regular expressions in JavaScript: https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions
        const shrugRegex = /^\/shrug/;
        const workoutBotRegex = /^\/workout/;
        const workoutLinkRegex = /^\/workout\s+link/;
        const workoutLogRegex = /^\/workout\s+log/
        const workoutLogGroupRegex = /^\/workout\s+log\s+(\d+)\/(\d+)\s*-\s*([^]*)/;

        // Check if the GroupMe message has content and if the regex pattern is true
        if (messageText && shrugRegex.test(messageText) && message.name!=process.env.BOT_NAME) {
            // Check is successful, return a message!
            return '¯\\_(ツ)_/¯';
        }

        if (messageText && workoutBotRegex.test(messageText)  && message.name!=process.env.BOT_NAME) {
            if (workoutLinkRegex.test(messageText)) {
                this.sendMainChannelMessage('https://docs.google.com/spreadsheets/d/1S1i1rKGhGIMxZfX9Pa9A9R57XAZ-NvB5np35ed8KCpg/edit?usp=sharing');
                return 'https://docs.google.com/spreadsheets/d/1S1i1rKGhGIMxZfX9Pa9A9R57XAZ-NvB5np35ed8KCpg/edit?usp=sharing';
            }
            else if (workoutLogRegex.test(messageText)) {
                var workout = workoutLogGroupRegex.exec(messageText);
                if (workout && workout.length == 4) {
                    let date = workout[1] + '/' + workout[2];
                    Workouts.updateSheet(message.name, date, workout[3]);
                    return 'workout added for ' + message.name + ' on ' + date + ' with content: ' + workout[3];
                }
                else {
                    return "I\'m sorry, I don't understand. Please format your message:/workout log <month#>/<day#> - <workout>";
                }
            }
            else{
                return "Available commands are: /workout link\n/workout log";
            }
        }

        return null;
    };

    /**
     * Sends a message to GroupMe with a POST request.
     *
     * @static
     * @param {string} messageText A message to send to chat
     * @return {undefined}
     */
    static sendMessage(messageText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        const body = {
            bot_id: botId,
            text: messageText
        };

        // Make the POST request to GroupMe with the http module
        const botRequest = https.request(options, function (response) {
            if (response.statusCode !== 202) {
                console.log('Rejecting bad status code ' + response.statusCode);
            }
        });

        // On error
        botRequest.on('error', function (error) {
            console.log('Error posting message ' + JSON.stringify(error));
        });

        // On timeout
        botRequest.on('timeout', function (error) {
            console.log('Timeout posting message ' + JSON.stringify(error));
        });

        // Finally, send the body to GroupMe as a string
        botRequest.end(JSON.stringify(body));
    };

    /**
     * Sends a message to GroupMe with a POST request.
     *
     * @static
     * @param {string} messageText A message to send to chat
     * @return {undefined}
     */
    static sendMainChannelMessage(messageText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.MAIN_BOT_ID ? process.env.MAIN_BOT_ID : process.env.BOT_ID;
    

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        const body = {
            bot_id: botId,
            text: messageText
        };

        // Make the POST request to GroupMe with the http module
        const botRequest = https.request(options, function (response) {
            if (response.statusCode !== 202) {
                console.log('Rejecting bad status code ' + response.statusCode);
            }
        });

        // On error
        botRequest.on('error', function (error) {
            console.log('Error posting message ' + JSON.stringify(error));
        });

        // On timeout
        botRequest.on('timeout', function (error) {
            console.log('Timeout posting message ' + JSON.stringify(error));
        });

        // Finally, send the body to GroupMe as a string
        botRequest.end(JSON.stringify(body));
    };
};

module.exports = Bot;
