const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const imagePath = process.argv[2];
const videoLengthSeconds = +process.argv[3];

if (!imagePath) {
  console.log(
    "Please provide an image file path as the first command line argument"
  );
  process.exit(1);
}

if (isNaN(videoLengthSeconds)) {
  console.log(
    "Please provide a valid video length (in seconds) as the second command line argument"
  );
  process.exit(1);
}

const outPutPath = "./video.mp4";

ffmpeg()
  .input(imagePath)
  .FPSInput(60)
  .loop(videoLengthSeconds)
  .videoFilter(
    `rotate='if(eq(mod(t,${videoLengthSeconds}),0),0,0.5*t)':c=none,chromakey=0x00FF00@0.1:0.1:0.2,setpts=N/60/TB`
  )
  .FPSOutput(60)
  .output(outPutPath)
  .on("error", (err) => {
    console.log("An error occurred: " + err.message);
    process.exit(1);
  })
  .on("end", () => {
    console.log("Video created successfully");
  })
  .run();
