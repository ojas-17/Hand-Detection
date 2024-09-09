import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const demosSection = document.getElementsByClassName("container")[0];

let handLandmarker = undefined;
let runningMode = "IMAGE";
let webcamRunning = false;

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

// Circle properties
let ballX = 320; // x-coordinate of the circle center
let ballY = 240; // y-coordinate of the circle center
const ballRadius = 10; // Radius of the circle
let leftX;
let leftY;
let rightX;
let rightY;

let left_click = false;
let right_click = false;

let showcamera = false;

let key_width = 40;
let key_height = 40;

let keyboard = [
    {
        "key": "Q",
        "x": 90,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "W",
        "x": 140,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "E",
        "x": 190,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "R",
        "x": 240,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "T",
        "x": 290,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "Y",
        "x": 340,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "U",
        "x": 390,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "I",
        "x": 440,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "O",
        "x": 490,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "P",
        "x": 540,
        "y": 240,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "A",
        "x": 110,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "S",
        "x": 160,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "D",
        "x": 210,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "F",
        "x": 260,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "G",
        "x": 310,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "H",
        "x": 360,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "J",
        "x": 410,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "K",
        "x": 460,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "L",
        "x": 510,
        "y": 290,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "Z",
        "x": 130,
        "y": 340,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "X",
        "x": 180,
        "y": 340,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "C",
        "x": 230,
        "y": 340,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "V",
        "x": 280,
        "y": 340,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "B",
        "x": 330,
        "y": 340,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "N",
        "x": 380,
        "y": 340,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "M",
        "x": 430,
        "y": 340,
        "width": 40,
        "height": 40,
        "left_click": false,
        "right_click": false
    },
    {
        "key": "Clear",
        "x": 250,
        "y": 190,
        "width": 170,
        "height": 40,
        "left_click": false,
        "right_click": false
    }
]

// Update x values
// keyboard.forEach(key => {
//     key.x += 50;
// });

// console.log(keyboard);

let keyboard_string = "";
let prev_key = undefined;
let current_key = undefined;

async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    // console.log(video.videoWidth, video.videoHeight);
    // canvasElement.width = 640;
    // canvasElement.height = 480;

    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await handLandmarker.setOptions({ runningMode: "VIDEO" });
    }

    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);

    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (!showcamera) {
        canvasCtx.fillStyle = 'gray'; // Set fill color
        canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }

    canvasCtx.font = '30px Arial';
    canvasCtx.fillStyle = 'black';
    canvasCtx.fillText("Output: ", 100, 100);
    canvasCtx.fillText(keyboard_string, 200, 100);

    for (const key of keyboard) {
        if ((current_key === key.key) && (key.left_click || key.right_click)) {
            canvasCtx.fillStyle = '#008d83'; // Set fill color
            key.left_click = false;
            key.right_click = false;
            if (key.key === "Clear")
                keyboard_string = "";
            else if (key.key === "Space")
                keyboard_string += " ";
            else if ((key.key !== prev_key)) {
                prev_key = key.key;
                keyboard_string += key.key;
            }
        }
        else {
            key.left_click = false;
            key.right_click = false;
            canvasCtx.fillStyle = 'aqua';
        }

        canvasCtx.strokeStyle = 'black';
        canvasCtx.lineWidth = 2;
        canvasCtx.fillRect(key.x, key.y, key.width, key.height);
        canvasCtx.strokeRect(key.x, key.y, key.width, key.height);
        canvasCtx.font = '30px Arial';
        canvasCtx.fillStyle = 'black';
        if(key.key === "Clear")
            canvasCtx.fillText(key.key, key.x + 40, key.y + 30);
        else
            canvasCtx.fillText(key.key, key.x + 6, key.y + 30);
    }

    if (results.landmarks) {
        // console.log(results);

        let body = document.getElementsByTagName("body")[0];
        if (results.worldLandmarks.length !== 0) {
            if (results.worldLandmarks.length === 2) {
                let point1 = results.worldLandmarks[0][8];
                let point2 = results.worldLandmarks[1][8];

                let left = results.landmarks[0][8];
                leftX = left.x * canvasElement.width;
                leftY = left.y * canvasElement.height;

                let right = results.landmarks[1][8];
                rightX = right.x * canvasElement.width;
                rightY = right.y * canvasElement.height;

                canvasCtx.beginPath(); // Begin a new path
                canvasCtx.arc(canvasElement.width - leftX, leftY, ballRadius, 0, 2 * Math.PI); // Draw the circle
                canvasCtx.lineWidth = 3; // Border width
                if (point1.z < -0.04) {
                    canvasCtx.fillStyle = '#00f421'; // Set fill color
                    canvasCtx.fill(); // Fill the circle with the color

                    for (const key of keyboard) {
                        if ((Math.abs(key.x + (key.width / 2) - (canvasElement.width - leftX)) < key.width / 2) && (Math.abs(key.y + 20 - leftY) < 20)) {
                            current_key = key.key;
                            key.left_click = true;
                        }
                        else
                            key.left_click = false;
                    }

                    if ((Math.abs(ballX - leftX) < 20) && (Math.abs(ballY - leftY) < 20))
                        left_click = true;
                    else
                        left_click = false;
                }
                else {
                    canvasCtx.fillStyle = '#00a26c'; // Set fill color
                    canvasCtx.fill(); // Fill the circle with the color
                    canvasCtx.strokeStyle = 'black'; // Border color
                    canvasCtx.stroke();
                }
                canvasCtx.closePath();

                canvasCtx.beginPath(); // Begin a new path
                canvasCtx.arc(canvasElement.width - rightX, rightY, ballRadius, 0, 2 * Math.PI); // Draw the circle
                canvasCtx.lineWidth = 3; // Border width
                if (point2.z < -0.04) {
                    canvasCtx.fillStyle = '#00f421'; // Set fill color
                    canvasCtx.fill(); // Fill the circle with the color

                    for (const key of keyboard) {
                        if ((Math.abs(key.x + (key.width / 2) - (canvasElement.width - rightX)) < key.width / 2) && (Math.abs(key.y + 20 - rightY) < 20)) {
                            current_key = key.key;
                            key.right_click = true;
                        }
                        else
                            key.right_click = false;
                    }

                    if ((Math.abs(ballX - rightX) < 20) && (Math.abs(ballY - rightY) < 20))
                        right_click = true;
                    else
                        right_click = false;
                }
                else {
                    canvasCtx.fillStyle = '#00a26c'; // Set fill color
                    canvasCtx.fill(); // Fill the circle with the color
                    canvasCtx.strokeStyle = 'black'; // Border color
                    canvasCtx.stroke();
                }
                canvasCtx.closePath();
            }

            else {
                let point = results.worldLandmarks[0][8];
                let point2D = results.landmarks[0][8];

                canvasCtx.beginPath(); // Begin a new path
                canvasCtx.arc(canvasElement.width - (point2D.x * canvasElement.width), point2D.y * canvasElement.height, ballRadius, 0, 2 * Math.PI); // Draw the circle
                // console.log(canvasElement.width - (point2D.x * canvasElement.width), point2D.y * canvasElement.height);
                canvasCtx.lineWidth = 3; // Border width
                if (point.z < -0.04) {
                    canvasCtx.fillStyle = '#00f421'; // Set fill color
                    canvasCtx.fill(); // Fill the circle with the color

                    for (const key of keyboard) {
                        if ((Math.abs(key.x + (key.width / 2) - (canvasElement.width - point2D.x * canvasElement.width)) < key.width / 2) && (Math.abs(key.y + 20 - point2D.y * canvasElement.height) < 20)) {
                            current_key = key.key;
                            key.left_click = true;
                        }
                        else
                            key.left_click = false;
                    }

                    if ((Math.abs(ballX - point2D.x * canvasElement.width) < 20) && (Math.abs(ballY - point2D.y * canvasElement.height) < 20))
                        left_click = true;
                    else
                        left_click = false;
                }
                else {
                    canvasCtx.fillStyle = '#00a26c'; // Set fill color
                    canvasCtx.fill(); // Fill the circle with the color
                    canvasCtx.strokeStyle = 'black'; // Border color
                    canvasCtx.stroke();
                }
                canvasCtx.closePath();
            }
        }
        // else
        //     body.classList.remove("detected1");

        if (left_click || right_click) {
            ballX = Math.floor(Math.random() * ((canvasElement.width - 40) - 40)) + 40;
            ballY = Math.floor(Math.random() * ((canvasElement.height - 40) - 40)) + 40;
        }

        // canvasCtx.beginPath(); // Begin a new path
        // canvasCtx.arc(canvasElement.width - ballX, ballY, ballRadius, 0, 2 * Math.PI); // Draw the circle
        // canvasCtx.fillStyle = 'black'; // Set fill color
        // canvasCtx.fill(); // Fill the circle with the color
        // canvasCtx.closePath();

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
