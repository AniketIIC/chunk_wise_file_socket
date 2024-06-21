const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// Input video file path
const inputVideo = 'assets/temp/videos/1.mp4';

// Output directory for video chunks
const outputDirectory = 'output-chunks/';

// Chunk duration in seconds
const chunkDuration = 10; // Adjust as needed

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

// Create a function to split the video into chunks
function splitVideo() {
    ffmpeg(inputVideo)
        .outputOptions(['-map 0', `-f segment`, `-segment_time ${chunkDuration}`])
        .output(path.join(outputDirectory, 'chunk-%03d.mp4'))
        .on('end', () => {
            console.log('Video has been split into chunks.');
        })
        .on('error', (err) => {
            console.error('Error:', err);
        })
        .run();
}

// Call the splitVideo function to start splitting the video
splitVideo();
