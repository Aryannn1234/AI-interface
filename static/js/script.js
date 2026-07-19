const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");

const uploadContent = document.querySelector(".upload-content");

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";

    uploadContent.style.display = "none";

    result.style.display = "none";

    resetBtn.style.display = "none";

});


predictBtn.addEventListener("click", async () => {

    if (!imageInput.files.length) {

        alert("Please upload an image.");

        return;

    }

    loading.style.display = "block";

    result.style.display = "none";

    document.getElementById("statusText").textContent =
    "Analyzing...";

    const formData = new FormData();

    formData.append("image", imageInput.files[0]);

    try{

        const response = await fetch("/predict",{

            method:"POST",

            body:formData

        });

        if(!response.ok){

            throw new Error(`HTTP ${response.status}`);

        }

        const data = await response.json();

        if(!data.predictions){

            throw new Error("Invalid response from Flask");

        }

        loading.style.display = "none";

        result.style.display = "block";

        document.getElementById("statusText").textContent =
        "Analysis Complete";

        document.getElementById("time").textContent =
        data.inference_time;

        const predictionList =
        document.getElementById("predictionList");

        predictionList.innerHTML = "";

        const topPrediction =
        data.predictions[0];

        /*----------------------------------
    ANIMATED CONFIDENCE RING
----------------------------------*/

const confidence = topPrediction.confidence;

const confidenceText =
document.getElementById("confidenceValue");

const ring =
document.querySelector(".confidence-ring");

let current = 0;

const animation = setInterval(() => {

    current += 2;

    if (current >= confidence) {

        current = confidence;

        clearInterval(animation);

    }

    confidenceText.textContent =
    current.toFixed(0) + "%";

    ring.style.background = `conic-gradient(
        #A855F7 ${current * 3.6}deg,
        rgba(255,255,255,.08) ${current * 3.6}deg
    )`;

}, 15);
       data.predictions.forEach((item, index) => {

    let badge = "Low Confidence";

    if (item.confidence >= 90) {

        badge = "Very High Confidence";

    }

    else if (item.confidence >= 70) {

        badge = "High Confidence";

    }

    else if (item.confidence >= 50) {

        badge = "Moderate Confidence";

    }

    const card = document.createElement("div");

    card.className = "prediction-card";

    card.style.animationDelay = `${index * 0.15}s`;

    card.innerHTML = `

        <div class="prediction-top">

            <div class="rank">

                #${index + 1}

            </div>

            <div class="label">

                ${item.label}

                <br>

                <small style="color:#C4B5FD;">

                    ${badge}

                </small>

            </div>

            <div class="percent">

                ${item.confidence}%

            </div>

        </div>

        <div class="bar">

            <div class="fill"></div>

        </div>

    `;

    predictionList.appendChild(card);

    setTimeout(() => {

        card.querySelector(".fill").style.width =
        item.confidence + "%";

    }, 150 + index * 180);

});

        /*----------------------------------
        SMART AI INSIGHT
----------------------------------*/

let insight = "";

if (confidence >= 90) {

    insight = `
        <strong>${topPrediction.label}</strong> was identified with
        <strong>${confidence}% confidence</strong>.

        <br><br>

        Pixels AI found a very strong visual match using TensorFlow MobileNetV2.

        The detected visual characteristics closely match the learned patterns of this object, making this prediction highly reliable.
    `;

}

else if (confidence >= 70) {

    insight = `
        <strong>${topPrediction.label}</strong> was detected with
        <strong>${confidence}% confidence</strong>.

        <br><br>

        The model is confident in this prediction, although a few visually similar categories may also share similar features.

        You can compare the alternative predictions shown above.
    `;

}

else if (confidence >= 50) {

    insight = `
        <strong>${topPrediction.label}</strong> was predicted with
        <strong>${confidence}% confidence</strong>.

        <br><br>

        This image contains features that overlap with multiple categories.

        Consider reviewing the Top 5 predictions for additional context.
    `;

}

else {

    insight = `
        Pixels AI detected multiple possible matches, but no category reached a high confidence score.

        <br><br>

        Try uploading a clearer image with better lighting, higher resolution, or a closer view of the subject for improved accuracy.
    `;

}

document.getElementById("aiInsight").innerHTML = insight;

        resetBtn.style.display = "flex";

    }

    catch(error){

        console.error(error);

        loading.style.display = "none";

        document.getElementById("statusText").textContent =
        "Prediction Failed";

        alert(`Prediction failed.\n\n${error.message}`);

    }

});


resetBtn.addEventListener("click",()=>{

    imageInput.value = "";

    preview.src = "";

    preview.style.display = "none";

    uploadContent.style.display = "flex";

    result.style.display = "none";

    loading.style.display = "none";

    document.getElementById("statusText").textContent =
    "Waiting for Image";

    document.getElementById("time").textContent =
    "0";

    document.getElementById("confidenceValue").textContent =
    "0%";

    document.querySelector(".confidence-ring").style.background =
    `conic-gradient(
        #A855F7 0deg,
        rgba(255,255,255,.08) 0deg
    )`;

    document.getElementById("aiInsight").innerHTML =
    "Upload an image and Pixels AI will generate intelligent insights based on the prediction.";

    resetBtn.style.display = "none";

});