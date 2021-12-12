

//alert("within canvas js file ");
let canvas = document.querySelector("canvas");
let pencilColors = document.querySelectorAll(".color");
let pencilThickness = document.querySelector(".pencil-thickness-adjust");
let eraserThickness = document.querySelector(".eraser-thickness-adjust");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ismouseDown = false;
let eraserColor = "white";
let eraserWidth = 3;
let penColor = "red";
let penWidth = 3;

let track = 0;
let undoRedoTracker = [];
//undoRedoTracker.push(canvas.toDataURL());
//ctx .fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener("mousedown", (e) => {
  ismouseDown = true;
  let strokeObj = {
    x: e.clientX,
    y: e.clientY,
    color: eraserFlag ? eraserColor : penColor,
    width: eraserFlag ? eraserWidth : penWidth,
    identifier:"mousedown"
  };
  undoRedoTracker.push(strokeObj);
  track=undoRedoTracker.length-1;

  socket.emit("beginPath",strokeObj);
 // beginPath(strokeObj);
});

undo.addEventListener("click", (e) => {
    // console.log("undo clicked");
    // console.log(track);
  if (track>0) {
    track--;
  }

  let strokeObj={
    "track_val":track,
    "undoredo":undoRedoTracker
  }
 
  
//   let url = undoRedoTracker[track];
//   let img = document.createElement("img");
//   img.src = url;
//   img.onload = (e) => {
//    // console.log("image loaded");
//    downloadImg(url);
//     ctx.drawImage(img, 0,0,canvas.width,canvas.height);
//   //  document.body.append(canvas);
//  }

socket.emit("redraw",strokeObj);
  // redraw();
});



redo.addEventListener("click", (e) => {
   // console.log("redo clicked");
   // console.log(track);
  if (track < undoRedoTracker.length - 1) {
    track++;
  //  return;
  }
  let strokeObj={
    "track_val":track,
    "undoredo":undoRedoTracker
  }
  // let url = undoRedoTracker[track];
  // let img = document.createElement("img");
  // img.src = url;
//   img.onload = (e) => {
//     //  // console.log("image loaded");
//     //  downloadImg(url);
//     //  ctx.drawImage(img, 0,0,canvas.width,canvas.height);
//    //  document.body.append(canvas);
//  }

socket.emit("redraw",strokeObj);
 //redraw();
  
});

canvas.addEventListener("mousemove", (e) => {
//   console.log("within click listener");
//   console.log(ismouseDown);
  if (!ismouseDown) {
    return;
  }
  let strokeObj = {
    x: e.clientX,
    y: e.clientY,
    color: eraserFlag ? eraserColor : penColor,
    width: eraserFlag ? eraserWidth : penWidth,
    identifier:"mousemove"
  };
 undoRedoTracker.push(strokeObj);
 track=undoRedoTracker.length-1; 
 //drawPath(strokeObj);
 socket.emit("drawPath",strokeObj);
});
canvas.addEventListener("mouseup", (e) => {
  ismouseDown = false;
 // undoRedoTracker.push(canvas.toDataURL());
 // console.log(undoRedoTracker);
  
});

function beginPath(strokeObj) {
  console.log("beginPath called");
  ctx.strokeStyle = strokeObj.color;
  ctx.lineWidth = strokeObj.width;
  ctx.beginPath();
  ctx.moveTo(strokeObj.x, strokeObj.y);
}
function drawPath(strokeObj) {
  console.log("drawPath called");
  ctx.strokeStyle = strokeObj.color;
  ctx.lineWidth = strokeObj.width;
  ctx.lineTo(strokeObj.x, strokeObj.y);
  ctx.stroke();
}

function redraw(strokeObj){
  console.log("redraw called");
  track=strokeObj.track_val;
  undoRedoTracker=strokeObj.undoredo;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <=track; i++) {
    let { x, y,color, width,identifier } = undoRedoTracker[i];
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (identifier == "mousedown") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (identifier == "mousemove") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
}
pencilColors.forEach((colorElement) => {
  colorElement.addEventListener("click", (e) => {
    let color = colorElement.classList[0];
    penColor = color;
  });
});
pencilThickness.addEventListener("change", (e) => {
  penWidth = pencilThickness.value;
});

eraserThickness.addEventListener("change", (e) => {
  eraserWidth = eraserThickness.value;
});

download.addEventListener("click", (e) => {
  let a = document.createElement("a");
  let url = canvas.toDataURL();
  a.href = url;
  a.download = "board.jpg";
  a.click();
});
function downloadImg(url){
    let a = document.createElement("a");
  let ref = url;
  a.href = ref;
  a.download = "board.jpg";
  a.click();
}

socket.on("beginPath",(data)=>{
  beginPath(data);
});

socket.on("drawPath",data=>{
  drawPath(data);
});


socket.on("redraw",data=>{
  redraw(data);
})