import fs from 'fs'
import { Readable } from 'stream'
import * as formidable from 'formidable'

const tempPath = "assets/temp/videos"
const CHUNK_SIZE = 10000000; // 10MB

async function sleep(ms) {
    return new Promise((r) => setTimeout(() => { }, ms));
}
export const processFile = async (req, res) => {
    const filePath = `${tempPath}/1.mp4`;

    const readStream = fs.createReadStream(filePath, { highWaterMark: 1024 * 1024 * 10 })
    // const writeStream = fs.createWriteStream("assets/temp/videos/2.mp4")
    let i = 0;
    readStream.on('data', async (chunk) => {
        console.log(chunk);
        //console.log('chunk received');
        //console.log(typeof chunk);
        const filePath = `${tempPath}/${Date.now()}.mp4`
        fs.writeFileSync(filePath, chunk)
        console.log("loop", i);
        await sleep(5000);

        i++;
        console.log("loop cont", i);

        /* const filePath = `${tempPath}/video-${i}.mp4`
         fs.writeFileSync(filePath, chunk)
         i++*/
        // writeStream.write(chunk)

    })
    readStream.on('end', () => console.log('Reading complete'));
    await sleep(10000)
    // return res.status(200).send('ho gaya')
}

//processFile();