const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = path.resolve(__dirname, '../../temp_car_assets/Create_a_cinematic_1080p_202602121026.mp4');
const outputDir = path.resolve(__dirname, '../public/images/car-sequence');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Extracting frames from ${inputFile} to ${outputDir}...`);

ffmpeg(inputFile)
  .outputOptions('-q:v 2') // High quality jpeg
  .output(path.join(outputDir, 'frame-%03d.jpg'))
  .on('end', () => {
    console.log('Frame extraction completed successfully.');
    // Count frames
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
    console.log(`Total frames extracted: ${files.length}`);
  })
  .on('error', (err) => {
    console.error('Error extracting frames:', err);
    process.exit(1);
  })
  .run();
