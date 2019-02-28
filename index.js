const program = require('commander')
const fs = require('fs')

const parseFile = require('./parser')

const main = async () => {
    program
        .option('-i --input <file>', 'Input file')
        .option('-o --output <file>', 'Output file (optional, defaults to stdout)')
        .parse(process.argv)

    if(!program.input) throw new Error('Input file is required')

    try {
        const inputFile = program.input

        const data = await parseFile(inputFile)
        const outputData = JSON.stringify(data)

        if(program.output) {
            const outputFile = program.output

            fs.writeFile(outputFile, outputData, err => {
                if(err) {
                    console.error(`Error writing output: ${err}`)
                } else {
                    console.log('Success!');
                }
            })
        } else {
            process.stdout.write(outputData)
        }
    } catch(error) {
        console.error(error)
    }
}

main()
