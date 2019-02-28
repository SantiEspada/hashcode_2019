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
        let tags = {}
        const pictures = lines.map((line, id) => {
            const [ orientation, numberOfTags, ...pictureTags] = line.split(' ')

            if(Number(numberOfTags) !== pictureTags.length) {
                reject(`[parsing error] Declared number of tags does not match actual number of tags in picture #${id}`)
            }

            pictureTags.forEach(tag => {
                if(Array.isArray(tags[tag])) {
                    tags[tag].push(id)
                } else {
                    tags[tag] = [id]
                }
            })

            return {
                id,
                orientation,
                tags: pictureTags
            }
        });
        
        const sortedTags =
            Object.keys(tags)
                .map(tag => ({ tag, pictures: tags[tag]}))
                .sort(({ pictures: picturesA }, { pictures: picturesB }) => (
                    picturesA.length > picturesB.length ? -1 : 1
                ))

        resolve({
            tags: sortedTags,
            pictures
        });
    } else {
        console.log(lines, lines.length, rows)
        reject('[parsing error] Declared number of pictures does not match number of lines')
    }
}

module.exports = parseFile
