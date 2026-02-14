// script.js

let model, webcam, maxPredictions;

async function init() {
    const URL = "model/";  // Path to your model folder
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the Teachable Machine model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam (200x200 for faster performance), flip horizontally if needed
    webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup(); // Request access to camera
    await webcam.play();  // Start webcam stream

    // Start the prediction loop
    window.requestAnimationFrame(loop);
}

async function loop() {
    webcam.update(); // Update webcam frame
    await predict(); // Run prediction
    window.requestAnimationFrame(loop); // Repeat this loop
}

async function predict() {
    // Get predictions for the current webcam frame
    const prediction = await model.predict(webcam.canvas);

    // Find the prediction with the highest probability
    let highest = prediction.reduce((a, b) =>
        a.probability > b.probability ? a : b
    );

    // Send prediction to MIT App Inventor only if confidence is above 85%
    if (highest.probability > 0.85) {
        sendToApp(highest.className);
    }
}

function sendToApp(result) {
    // This sends the detected label to MIT App Inventor
    if (window.AppInventor) {
        window.AppInventor.setWebViewString(result);
    }
}
