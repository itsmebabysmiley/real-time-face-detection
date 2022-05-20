let vdo = document.getElementById("video");
let img = document.getElementById("img");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let model;
let p_scores;
const setUpCam = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 600, height: 400 },
      audio: false,
    })
    .then((stream) => {
      vdo.srcObject = stream;
    });
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(vdo, false);
  if(prediction.length > 0){
    console.log("probability:",prediction[0].probability);
    console.log(prediction);
    console.log("right eye : ",prediction[0].landmarks[0]);
    console.log("left eye : ",prediction[0].landmarks[1]);
    console.log("nose : ", prediction[0].landmarks[2]);
    console.log("mouth : ", prediction[0].landmarks[3]);
    console.log("right ear : ",prediction[0].landmarks[4]);
    console.log("left ear : ",prediction[0].landmarks[5]);
    if(prediction[0].probability > 0.8){
      console.log("Face Detected!");
      // console.log("probability:",prediction[0].probability);
      // console.log("topLeft:",prediction[0].topLeft);
      // console.log("bottomRight:", prediction[0].bottomRight);
      // console.log("landmarks:");
      // console.log("right eye : ",prediction[0].landmarks[0]);
      // console.log("left eye : ",prediction[0].landmarks[1]);
      // console.log("nose : ", prediction[0].landmarks[2]);
      // console.log("mouth : ", prediction[0].landmarks[3]);
      // console.log("right ear : ",prediction[0].landmarks[4]);
      // console.log("left ear : ",prediction[0].landmarks[5]);
      ctx.drawImage(vdo, 0 , 0 , 600, 400);
      prediction.forEach((p)=>{
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "blue";
        ctx.rect(
            p.topLeft[0],
            p.topLeft[1],
            p.bottomRight[0] - p.topLeft[0],
            p.bottomRight[1] - p.topLeft[1]
        );
        ctx.stroke();
  
        ctx.fillStyle = "red";
        p.landmarks.forEach((landmarks)=>{
            ctx.fillRect(landmarks[0], landmarks[1], 5,5);
        });
    });
    }else{
      ctx.drawImage(vdo, 0 , 0 , 600, 400);
    }
   
  }else{
    console.log("Object detected!");
  }
  
};

setUpCam();
vdo.addEventListener("loadeddata", async () => {
    model = await blazeface.load();
    setInterval(detectFaces, 1000);
});

