import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const demosSection = document.getElementsByClassName("container")[0];

let handLandmarker = undefined;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: runningMode,
        numHands: 2
    });
    demosSection.classList.remove("invisible");
};

createHandLandmarker();

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");


// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    // enableWebcamButton = document.getElementById("webcamButton");
    // enableWebcamButton.addEventListener("click", enableCam);

    setTimeout(enableCam, 1000);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam() {
    if (!handLandmarker) {
        console.log("ObjectDetector not loaded yet.");
        return;
    }

    if (webcamRunning === true) {
        webcamRunning = false;
        // enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
        webcamRunning = true;
        // enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }

    // getUsermedia parameters.
    const constraints = {
        video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

let lastVideoTime = -1;
let results = undefined;
// console.log(video);

// Rectangle properties
let x1 = 0;
let x2 = 630;
let y1 = 200;
let y2 = 200;
const width = 10;
const height = 80;

// Circle properties
let ballX = 320; // x-coordinate of the circle center
let ballY = 240; // y-coordinate of the circle center
const ballRadius = 10; // Radius of the circle
let xSpeed = 2;
let ySpeed = 2;

let showcamera = false;

async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await handLandmarker.setOptions({ runningMode: "VIDEO" });
    }

    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);
        // console.log(results);
        // console.log(results.landmarks[0][0]);

        // if (results.landmarks.length !== 0) {
        //     let point = results.landmarks[0][8];
        //     console.log(point.x);
        //     console.log(point.y);
        //     console.log(point.z);
        //     let body = document.getElementsByTagName("body")[0];
        //     // y = point.y * 480;
        //     // console.log(y);
        //     if (point.x < 0.5) {
        //         console.log(results.handednesses[0][0].categoryName);
        //         if (results.handednesses[0][0].categoryName == 'Right') {
        //             body.classList.remove("detected2");
        //             body.classList.add("detected1");
        //         }
        //         else if (results.handednesses[0][0].categoryName == 'Left') {
        //             body.classList.remove("detected1");
        //             body.classList.add("detected2");
        //         }
        //     }
        //     else {
        //         body.classList.remove("detected1");
        //         body.classList.remove("detected2");
        //     }
        // }

    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (!showcamera) {
        canvasCtx.fillStyle = 'gray'; // Set fill color
        canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }

    if (results.landmarks) {
        // for (const landmarks of results.landmarks) {
        //     drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        //         color: "#00FF00",
        //         lineWidth: 5
        //     });
        //     drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
        // }

        if (results.landmarks.length !== 0) {
            if (results.landmarks.length === 2) {
                let point1 = results.landmarks[0][8];
                let point2 = results.landmarks[1][8];
                if (results.handednesses[0][0].categoryName == 'Left') {
                    y1 = point1.y * 480;
                    y2 = point2.y * 480;
                }
                else {
                    y2 = point1.y * 480;
                    y1 = point2.y * 480;
                }

            }

            else {
                let point = results.landmarks[0][8];
                if (results.handednesses[0][0].categoryName == 'Left') {
                    y1 = point.y * 480;
                }
                else if (results.handednesses[0][0].categoryName == 'Right') {
                    y2 = point.y * 480;
                }
            }
            if (y1 < 0)
                y1 = 0;
            if (y1 > 400)
                y1 = 400;
            if (y2 < 0)
                y2 = 0;
            if (y2 > 400)
                y2 = 400;
        }
        canvasCtx.fillStyle = 'blue'; // Set fill color
        canvasCtx.fillRect(x1, y1, width, height);
        canvasCtx.fillRect(x2, y2, width, height);

        ballX += xSpeed;
        ballY += ySpeed;

        if ((ballY < 10) || (ballY > 470)) {
            ySpeed *= -1;
        }
        if (((ballX < 20) && (ballY > y1 && ballY < y1 + 80)) || ((ballX > 620) && (ballY > y2 && ballY < y2 + 80))) {
            xSpeed *= -1;
        }

        if (ballX < 0 || ballX > 640) {
            xSpeed = 0;
            ySpeed = 0;

            // Create a new Image object
            const img = new Image();
            // Set the image source
            img.src = 'gameover.png'; // Replace with the path to your image

            // Draw the image once it's loaded
            img.onload = () => {
                // Draw the image on the canvas
                canvasCtx.drawImage(img, 0, 0, 100, 100); // Draw the image at (0,0) with the same dimensions as the canvas
            };

            // Optional: handle image loading errors
            img.onerror = () => {
                console.error('Failed to load image.');
            };
        }

        canvasCtx.beginPath(); // Begin a new path
        canvasCtx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI); // Draw the circle
        canvasCtx.fillStyle = 'black'; // Set fill color
        canvasCtx.fill(); // Fill the circle with the color

        if ((ballX < 0) || (ballX > 640)) {
            // Save the current state
            canvasCtx.save();

            // Flip horizontally by scaling the x-axis by -1
            canvasCtx.translate(320, 240); // Translate to the center of the rectangle
            canvasCtx.scale(-1, 1); // Flip horizontally
            canvasCtx.translate(-320, -240); // Translate back to the original position

            // Set font style and size
            canvasCtx.font = '30px Arial';
            // Set text color
            canvasCtx.fillStyle = '#b70000';
            // Draw filled text
            canvasCtx.fillText('Game Over', 240, 250);

            // Restore the saved state
            canvasCtx.restore();
        }
    }
    canvasCtx.restore();

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}

//----------------------------------------------------------------------------------

let sidebar = document.getElementsByClassName("sidebar")[0];
let menu = document.getElementById("menu")
let cross = document.getElementById("cross")

function closemenu() {
    sidebar.classList.add("sidebar-hidden");
    menu.classList.remove("hidden");
    cross.classList.add("hidden");
}

function openmenu() {
    sidebar.classList.remove("sidebar-hidden");
    cross.classList.remove("hidden");
    menu.classList.add("hidden");
}

menu.addEventListener("click", openmenu)
cross.addEventListener("click", closemenu);

let camera = document.getElementById("show-camera");
function display_camera() {
    if (showcamera === true) {
        showcamera = false;
        camera.innerHTML = "SHOW CAMERA";
    }
    else {
        showcamera = true;
        camera.innerHTML = "HIDE CAMERA";
    }
}
camera.addEventListener("click", display_camera);

let try_again = document.getElementById("try-again");
function reset() {
    ballX = 320; // x-coordinate of the circle center
    ballY = 240; // y-coordinate of the circle center
    xSpeed = 2;
    ySpeed = 2;
}
try_again.addEventListener("click", reset);