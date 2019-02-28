const fs = require('fs')

const parseFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) return reject(err)
            
            parseData(data.toString(), resolve, reject)
        })
    })
}

const parseData = (data, resolve, reject) => {
    const lines = data.split('\n')
    lines.pop() // remove last empty element

    const numberOfPictures = Number(lines.shift())
    
    if(numberOfPictures === lines.length) {
        const pictures = lines.map((line, id) => {
            const [ orientation, numberOfTags, ...tags] = line.split(' ')

            return {
                id,
                orientation,
                tags
            }
        });

        resolve(pictures);
    } else {
        console.log(lines, lines.length, rows)
        reject('[parsing error] Declared number of pictures does not match number of lines')
    }
}

module.exports = parseFile
