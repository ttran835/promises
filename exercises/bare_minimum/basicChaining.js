/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var Promise = require('bluebird');
var chainedFiles = require('./promisification.js');
var pluckLine = require('./callbackReview.js');
var pluckFirstLineFromFileAsync = Promise.promisify(pluckLine.pluckFirstLineFromFile);

var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return pluckFirstLineFromFileAsync(readFilePath)
    .then(function(user) {
      return chainedFiles.getGitHubProfileAsync(user);
    })
    .then(function(userInfo) {
      return new Promise(function (fulfill, reject) {
        fs.writeFile(writeFilePath, JSON.stringify(userInfo), 'utf-8', function (error) {
          if (error) {
            console.log('There is an error...Please see, ', error);
            reject(error);
          } else {
            fulfill(userInfo); 
          }
        });
      });
    })
    .catch(function (error) {
      console.log('Please see this error ,', error);
    });
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
