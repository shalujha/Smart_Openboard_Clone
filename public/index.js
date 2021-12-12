let toolboxIcon = document.querySelector(".toolbox-icon");
let toolboxItems = document.querySelector(".toolbox-items");
let pencilToolbox = document.querySelector(".pencil-toolbox");
let eraserToolbox = document.querySelector(".eraser-toolbox");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let stickyNote = document.querySelector(".stickyNote");
let stickyNoteToolbox = document.querySelector(".sticky-notes-toolbox");
let upload = document.querySelector(".upload");
let download = document.querySelector(".download");
let downloadFlag = false;
let eraserFlag=false;
let isCtrlPressed=false;
document.addEventListener("keydown",(e)=>{
    if(e.ctrlKey){
        isCtrlPressed=true;
    }
});

document.addEventListener("keyup",(e)=>{
    isCtrlPressed=false;
});
pencilToolbox.style.display = "none";
eraserToolbox.style.display = "none";
toolboxIcon.addEventListener("click", () => {
  let icon = toolboxIcon.children[0];
  let className = icon.classList[1];
  if (className == "fa-bars") {
    closeToolBox(icon);
  } else {
    openToolBox(icon);
  }
});

download.addEventListener("click", (e) => {
  downloadFlag = !downloadFlag;
});
function closeToolBox(icon) {
  icon.classList.remove("fa-bars");
  icon.classList.add("fa-times");
  toolboxItems.style.display = "none";
}

function openToolBox(icon) {
  icon.classList.add("fa-bars");
  icon.classList.remove("fa-times");
  toolboxItems.style.display = "flex";
  pencilToolbox.style.display = "none";
  eraserToolbox.style.display = "none";
}

pencil.addEventListener("click", () => {
  if (pencilToolbox.style.display == "none") {
    pencilToolbox.style.display = "flex";
  } else {
    pencilToolbox.style.display = "none";
  }
});

eraser.addEventListener("click", () => {
  if (eraserToolbox.style.display == "none") {
    eraserToolbox.style.display = "flex";
    eraserFlag=true;
  } else {
    eraserFlag=false;
    eraserToolbox.style.display = "none";
  }
});

stickyNote.addEventListener("click", () => {
  
  createStickyNote();
});

function createStickyNote(textValue) {
  let noteCont = document.createElement("div");
  noteCont.setAttribute("class", "sticky-note");
  

  noteCont.innerHTML = `
    <div class="header">
                <div class="minimize"></div>
                <div class="delete"></div>
            </div>
<div class="notecont"></div><textarea rows="15" placeholder="Enter your note" ></textarea></div>
    `;
  if (textValue) {
    noteCont.querySelector("textarea").value = textValue;
  }

document.body.appendChild(noteCont);
let minimizeElement = noteCont.querySelector(".minimize");
  let deleteElement = noteCont.querySelector(".delete");
  let textBox = noteCont.querySelector("textarea");
 
  minimizeElement.addEventListener("click", () => {
      console.log("minimise got clicked");
      console.log(textBox.style.display);
    if (textBox.style.display == "none") {
      textBox.style.display = "block";
    } else {
      textBox.style.display = "none";
    }
  });
  deleteElement.addEventListener("click", () => {
    noteCont.remove();
  });

 // handleDownload(noteCont);
  noteCont.onmousedown = function (event) {
    dragAndDrop(noteCont, event);
};
noteCont.ondragstart = function () {
    return false;
};
}
// function handleDownload(noteCont) {
//   console.log("download got clicked");
//   console.log(downloadFlag);
//   noteCont.addEventListener("contextmenu", (e) => {
//     if (!downloadFlag) {
//       return;
//     }
//     console.log("download got clicked");
//     let textBox = noteCont.querySelector("textarea");
//     var textFileAsBlob = new Blob([textBox.value], { type: "text/plain" });
//     var downloadLink = document.createElement("a");
//     downloadLink.download = "data.txt";
//     downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
//     downloadLink.click();
//   });
// }

upload.addEventListener("click", (e) => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();
  input.addEventListener("change", () => {
    let file = input.files[0];
    var fr = new FileReader();
    fr.onload = function () {
      createStickyNote(fr.result);
    };
    fr.readAsText(file);
  });
});
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}



