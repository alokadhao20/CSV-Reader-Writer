
const csvFilePath = './VSTSusersAll-29-10-2018.csv';

const async = require('async');
parseCSVtoJson(csvFilePath, function (err, users) {
   
    var finalObject = [];

    async.mapSeries(users, processData.bind(this, finalObject), function (err, result) {
        if(err){
            console.log("error during processData", err);
        } else {
            console.log("MSPS total => ",MSPS.length);
            console.log("MSES total => ",MSES.length);
            console.log("Basic total => ",Basic.length);
            console.log("Stakeholder total => ",Stakeholder.length);
            var finalArray = MSES.concat(MSPS,Basic,Stakeholder); 
            convertJsonDataToCSV(finalArray, function (err, csvData) {
                if (err) {
                    console.log('Some error occured -Data was unable to convert into CSV');
                } else {
                    // console.log('data converted to CSV format', csvData);
            
                    writeCSVdataToFile('Output/VSTSusersAll-29-10-2018.csv', csvData, function (err, result) {
                        if (err) {
                            console.log('Some error occured - file either not saved or corrupted file saved.');
                        } else {
                            console.log('It\'s saved!');
                        }
                    });
                }
            });
        }
    })
 
})

function processData(finalObject, user, callback) {
    // console.log("In processData - current user is ", user);
    let accessLevel = user['Access Level'];
    // console.log("user Access Level ", accessLevel);
    if(accessLevel === 'Visual Studio Enterprise subscription') {
        // console.log("This is enterprise");
        MSES.push(user)
    } else if(accessLevel === 'Stakeholder') {
        // console.log("This is Stakeholder");
        Stakeholder.push(user)
    } else if(accessLevel === 'Visual Studio Professional subscription') {
        // console.log("This is Professional");
        MSPS.push(user)
    } else if(accessLevel === 'Basic') {
        // console.log("This is Basic");
        Basic.push(user)
    }
    callback(null,'done');
}

function parseCSVtoJson(csvFilePath, callback) {
    const csv = require('csvtojson');
    
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        // console.log("data read from csv ", jsonObj.length);
        // console.log("data read from csv ", jsonObj);
        callback(null, jsonObj);
    });
}

function convertJsonDataToCSV(jsonObj, callback) {
    const Json2csvParser = require('json2csv').Parser;
    const json2csvParser = new Json2csvParser({
        jsonObj
    });
    const csvdata = json2csvParser.parse(jsonObj);
    // console.log("data json2csvParser ", csvdata);
    callback(null, csvdata);
}

function writeCSVdataToFile(filePath, csvData, callback) {
    var fs = require('fs');
    fs.writeFile(filePath, csvData, 'utf8', function (err) {
        if (err) {
            callback(err, null)
        } else {
            callback(null, 'saved')
        }
    });
}