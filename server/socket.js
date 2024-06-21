import fs from 'fs'
import { generateThumbnail } from './processVideo.js';


export const socketServer = async (socketIo) => {

    socketIo.on('connection', (client) => {
        console.log(client.id, "is connected");
        let writeStream// = fs.createWriteStream("video.mp4")
        let fileMetaData;
        const filePath1 = `videos/thumbnails/lg_.mp4`
        client.on('start_send', (data) => {

            console.log('start Time:', Date.now());
            writeStream = fs.createWriteStream(data.name)
            fileMetaData = data;
        })

        client.on('file_chunk', (chunk) => {
            console.log('incoming chunk:', Buffer.isBuffer(chunk));
            // fs.writeFileSync(`${Date.now()}-${fileMetaData.name}`, chunk)
            writeStream.write(chunk)
        })

        client.on('file_sent', async () => {

            await generateThumbnail(fileMetaData.name, "assests/thumbnail")
                .then(async (result) => {
                    console.log('thumbnail result is: ', result);
                    /* if (paths.thumbnail) {
                            for (let i = 0; i < paths.thumbnail.length; i++) {
                                let fileDataBuffer = fs.readFileSync(paths.thumbnail[i]);
                                let link = await aws.uploadFile({
                                    originalname:
                                        Date.now() + "-" + i + path.extname(paths.thumbnail[i]),
                                    buffer: fileDataBuffer,
                                });
                                thumbnails.push(link);
                            }
    
                            savedMedia.thumbnail = thumbnails;
                              const modifiedPaths = await uploadAndModifyGif(
                                  paths,
                                  newFileUrl
                              );
    
                            savedMedia.gif = modifiedPaths.gif;
                        }*/
                })
                .catch((error) => {
                    console.error(error);
                });

            writeStream = null;
            fileMetaData = null;
            console.log('end Time:', Date.now());
            client.emit("send", {})


        })


        client.on("disconnect", () => {
            console.log(client.id, "is disconnected");
        })
    })



}