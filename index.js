const parseFile = require('./parser')
const fs = require('fs')

const INPUT_FILE = './dataset/a_example.txt'
const OUTPUT_FILE = './out.json'

const main = async () => {
    try {
        const data = await parseFile(INPUT_FILE)

        fs.writeFile(OUTPUT_FILE, JSON.stringify(data), err => {
            if(err) {
                console.error(`Error writing output: ${err}`)
            } else {
                console.log('Success!');
            }
        })
    } catch(error) {
        console.error(error)
    }
};

main()
