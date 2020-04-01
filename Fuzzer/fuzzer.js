const fs = require('fs');
const Random = require('random-js');
const path = require('path');
const randomizer = new Random(Random.engines.mt19937().autoSeed());



var validFileExtensions = ["java"];

/*
This method will read all the files in a directory recursively
*/
const read = (dir) =>
    fs.readdirSync(dir)
    .reduce(function(files, file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            var readFilesList = read(path.join(dir, file));
            if (readFilesList != undefined) {
                //console.log("hello")
                return files.concat(readFilesList);
            } else {
                //console.log("mello")
                return files;
            }
        } else {
            if (validFileExtensions.indexOf(file.substring(file.lastIndexOf(".") + 1)) > -1) {
                return files.concat(path.join(dir, file));
            } else {
                //console.log("cello")
                return files;
            }
        }
    }, []);

/*
This function implements main fuzzer logic
Throws an error if directory is not given*/
function main(directoryPath) {
    //console.log(directoryPath)
    var args = process.argv.slice(2);

    var dirPath = directoryPath || args[0];

    if (!dirPath)
        throw new Error("not valid directory");

    var listOfFiles = read(dirPath);
    //console.log(listOfFiles)
    console.log(listOfFiles.length)
    var sampleList = randomizer.sample(listOfFiles, randomizer.integer(0, 0.10*listOfFiles.length));
    console.log(sampleList)
    sampleList.forEach(function(ele) {
        createRandomChangesInAFile(ele);
    });
}

function createRandomChangesInAFile(filePath) {
    var data = fs.readFileSync(filePath, 'utf-8');
    fs.writeFileSync(filePath,'','utf8');
    var lines = data.split("\n");
    //console.log(data)
    
    lines.forEach(function(line) {
        
        if (randomizer.bool(0.20)) {
            if (line.match(">") && !line.match("->")) {
                line = line.replace(/>/g, "<");
            }

            else if (line.match("<")) {
                line = line.replace(/</g, ">");
            }
        }

        if (randomizer.bool()){
            if (line.match("!=")){
                line=line.replace(/!=/g,'==');
            }
            else if (line.match('==')){
                line=line.replace(/==/g,'!=');
            }
        }

        if (randomizer.bool(0.2)){
            if (line.match(/[0]/)){
                line = line.replace(/[0]/g, "1");
            }
            else if (line.match(/[1]/)){
                line = line.replace(/[1]/,"0");
            }
        }

        if(line != '\r'){
            line += '\n'
        }

        fs.appendFileSync(filePath, line);


    });

    
}

exports.main = main;