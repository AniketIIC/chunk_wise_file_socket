import Ffmpeg from "fluent-ffmpeg";
import fs from 'fs'


Ffmpeg.setFfmpegPath(
    "C:/ProgramData/chocolatey/lib/ffmpeg/tools/ffmpeg/bin/ffmpeg.exe"
);

export const getVideoInfo = (inputPath) => {
    return new Promise((resolve, reject) => {
        return Ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
            if (error) {
                return reject(error);
            }
            const { duration, size, nb } = videoInfo.format;
            return resolve({
                size,
                durationInSeconds: Math.floor(duration),
            });
        });
    });
};

const stitchVideo = (thumbnailPath) => {
    // console.log(thumbnailPath);
    return new Promise(async (resolve, reject) => {
        Ffmpeg()
            .input(`${thumbnailPath}/output/t_%04d.jpg`)
            .inputFPS(3)
            .output(`${thumbnailPath}/output/4.mp4`)
            .on("start", function (commandLine) {
                let endDate = Date.now();
                console.log(endDate)
                //let diffTime = endDate - startDate;
                //  console.log("diffTime = " + diffTime / 1000 + " seconds");
                //  console.log("command", Date.now());
            })
            .on("progress", function (progress) { })
            .on("error", function (err) {
                console.log("An error occurred: " + err.message);
                reject(err);
            })
            .on("end", function () {
                console.log("Processing finished !");

                resolve();
            })
            .run();
    });
};

const takeScreenShot = (input, thumbnailPath) => {
    return new Promise(async (resolve, reject) => {
        const { durationInSeconds } = await getVideoInfo(input)

        const previewDuration = 5;
        const previewFPS = 3;
        const snapFPS = durationInSeconds / (previewDuration * previewFPS)

        if (!fs.existsSync(thumbnailPath + "/output/")) {
            fs.mkdirSync(thumbnailPath + "/output/", {
                recursive: true,
            });
        }

        Ffmpeg()
            .input(input)
            .size("?x240")
            .videoFilters(`fps=1/${snapFPS}`)
            .output(`${thumbnailPath}/output/t_%04d.jpg`)
            .on("start", function (commandLine) {
                //  const startDate = Date.now();
                console.log("Start video output stream", Date.now());
                // console.log("Spawned ffmpeg with command: " + commandLine);
            })
            .on("progress", function (progress) {
                // console.log("Processing: " + progress.percent + "% done");
            })
            .on("error", function (err) {
                console.log("An error occurred: " + err.message);
                reject(err);
            })
            .on("end", function () {
                console.log("Processing finished !");
                resolve();
            })
            .run();
    })
}

export const generateThumbnail = async (videoPath, thumbnailPath) => {

    if (!fs.existsSync(videoPath)) {
        fs.mkdirSync(videoPath, { recursive: true })
    }

    if (!fs.existsSync(thumbnailPath)) {
        fs.mkdirSync(thumbnailPath, { recursive: true })
    }

    const data = await getVideoInfo(videoPath);


    try {
        await takeScreenShot(videoPath, thumbnailPath)
        await stitchVideo(thumbnailPath)
        return 'Thumbnail Generated and Stitching Done'
    } catch (error) {
        console.log(error);
        throw new Error("wait..there is issue in generating thumbnail")
    }
}