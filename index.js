const parseFile = require('./parser')

const INPUT_FILE = './dataset/a_example.txt'

const main = async () => {
    try {
        const data = await parseFile(INPUT_FILE);

        console.log(data);
    } catch(error) {
        console.error(error)
    }
};

main()
