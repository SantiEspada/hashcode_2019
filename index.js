const program = require('commander')
const fs = require('fs')

const parseFile = require('./parser')

const getScore = ({ tags: tagsA }, { tags: tagsB }) => {
    tagsA = new Set(tagsA);
    tagsB = new Set(tagsB);

    const commonTags = new Set([...tagsA].filter(x => tagsB.has(x)));
    const remainingTagsA = (new Set([...tagsA].filter(x => !commonTags.has(x)))).size;
    const remainingTagsB = (new Set([...tagsB].filter(x => !commonTags.has(x)))).size;

    return Math.min(commonTags.size, remainingTagsA, remainingTagsB);
};

const main = async () => {
    program
        .option('-i --input <file>', 'Input file')
        .option('-o --output <file>', 'Output file (optional, defaults to stdout)')
        .parse(process.argv)

    if(!program.input) throw new Error('Input file is required')

    try {
        const inputFile = program.input

        const { pictures } = await parseFile(inputFile)
        const horizontalPics = []
        const verticalPics = []

        pictures.forEach(pic => {
            if(pic.orientation === 'V') {
                verticalPics.push(pic)
            } else {
                horizontalPics.push(pic)
            }
        })

        const matchedVerticalPics = new Set();
        const verticalPicsGroups = [];
        verticalPics.forEach(pic => {
            if(matchedVerticalPics.has(pic.id)) return;

            let bestScore = 0
            let bestMatch = null
            verticalPics.forEach(pic2 => {
                if(pic2.id === pic.id || matchedVerticalPics.has(pic2.id)) return

                const score = getScore(pic, pic2)
                if(score > bestScore) {
                    bestScore = score
                    bestMatch = pic2.id
                }
            })

            if(bestMatch) {
                matchedVerticalPics.add(pic.id)
                matchedVerticalPics.add(bestMatch)
                verticalPicsGroups.push([pic.id, bestMatch])
            }
        })

        let slides = [];
        
        verticalPicsGroups.forEach(group => {
            const [idA, idB] = group

            const picA = pictures[idA]
            const picB = pictures[idB]

            const tags = new Set([...picA.tags, ...picB.tags])

            slides.push({
                pics: [idA, idB],
                tags: [...tags]
            })
        })

        horizontalPics.forEach(pic => slides.push({
            pics: [pic.id],
            tags: pic.tags
        }))

        slides = slides.map((slide, key) => ({...slide, id: key}))

        let orderedSlides = [];
        const matchedSlides = new Set();

        let currentSlide = slides[0];

        while(orderedSlides.length < slides.length) {
            let bestScore = 0;
            let bestMatch = null;

            slides.forEach(slide2 => {
                if(slide2.id === currentSlide.id || matchedSlides.has(slide2.id)) return

                const score = getScore(currentSlide, slide2)
                if(score > bestScore) {
                    bestScore = score
                    bestMatch = slide2.id
                }
            })

            if(bestMatch) {
                matchedSlides.add(currentSlide.id)
                matchedSlides.add(bestMatch)
                orderedSlides.push(currentSlide, slides[bestMatch])
                currentSlide = slides[bestMatch]
            }
        }

        orderedSlides = 
            [...new Set(orderedSlides.map(slide => slide.id))]
                .map(id => slides[id])
        
        let output = `${orderedSlides.length}`
        orderedSlides.forEach(slide => {
            output += `\n${slide.pics.join(' ')}`
        })
        console.log(output)
    } catch(error) {
        console.error(error)
    }
}

main()
