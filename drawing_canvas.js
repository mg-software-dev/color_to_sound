


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
// this section of code is totally stolen from https://codepen.io/yananas/pen/rwvZvY
//but i have made minor modifications for this program
// BEGIN STOLEN SECTION



let isMouseDown=false;
let canvas = document.createElement('canvas');
let ctx_dr = canvas.getContext('2d');
let linesArray = [];
let currentSize = 5;
let currentColor = "rgb(200,20,100)";
let currentBg = "white";




//----------------------------------------------------
//----------------------------------------------------
// BUTTON EVENT HANDLERS



//----------------------------------------------------
// //----------------------------------------------------
// document.getElementById('canvasUpdate').addEventListener('click', ()=>
// {
//     createCanvas();
//     redraw();
// });


//----------------------------------------------------
//----------------------------------------------------
document.getElementById('colorpicker').addEventListener('change', function()
{
    currentColor = this.value;
});



//----------------------------------------------------
//----------------------------------------------------
document.getElementById('bgcolorpicker').addEventListener('change', function()
{
    ctx_dr.fillStyle = this.value;
    ctx_dr.fillRect(0, 0, canvas.width, canvas.height);
    redraw();
    currentBg = ctx_dr.fillStyle;
});


//----------------------------------------------------
//----------------------------------------------------
document.getElementById('controlSize').addEventListener('change', function()
{
    currentSize = this.value;
    document.getElementById("showSize").innerHTML = this.value;
});


//----------------------------------------------------
//----------------------------------------------------
document.getElementById('saveToImage').addEventListener('click', function()
{
    downloadCanvas(this, 'draw_canvas', 'masterpiece.png');
}, false);



//----------------------------------------------------
//----------------------------------------------------
// document.getElementById('clearCache').addEventListener('click', function()
// {
//     localStorage.removeItem("savedCanvas");
//     linesArray = [];
//     console.log("Cache cleared!");
// });




//----------------------------------------------------
//----------------------------------------------------
// REDRAW 
const redraw = ()=>
{
    for (let i = 1; i < linesArray.length; i++)
    {
        ctx_dr.beginPath();
        ctx_dr.moveTo(linesArray[i-1].x, linesArray[i-1].y);
        ctx_dr.lineWidth  = linesArray[i].size;
        ctx_dr.lineCap = "round";
        ctx_dr.strokeStyle = linesArray[i].color;
        ctx_dr.lineTo(linesArray[i].x, linesArray[i].y);
        ctx_dr.stroke();
    }
}




//----------------------------------------------------
//----------------------------------------------------
// CREATE CANVAS
const createCanvas = ()=>
{
    canvas.id = "draw_canvas";
    canvas.width = 300  // parseInt(document.getElementById("sizeX").value);
    canvas.height = 300 //parseInt(document.getElementById("sizeY").value);
    canvas.style.zIndex = 8;
    //canvas.style.position = "absolute";

    let sidebar_and_canvas = document.getElementById("sidebar");
    sidebar_and_canvas.appendChild(canvas);


    canvas.style.border = "1px solid";
    ctx_dr.fillStyle = currentBg;
    ctx_dr.fillRect(0, 0, canvas.width, canvas.height);
}



//----------------------------------------------------
//----------------------------------------------------
// DOWNLOAD CANVAS
const downloadCanvas = (link, canvas, filename)=>
{
    link.href = document.getElementById(canvas).toDataURL();
    link.download = filename;
}



// //----------------------------------------------------
// //----------------------------------------------------
// // SAVE FUNCTION
// const save = ()=>
// {
//     localStorage.removeItem("savedCanvas");
//     localStorage.setItem("savedCanvas", JSON.stringify(linesArray));
//     console.log("Saved canvas!");
// }



// //----------------------------------------------------
// //----------------------------------------------------
// // LOAD FUNCTION
// const load = ()=>
// {
//     if (localStorage.getItem("savedCanvas") != null)
//     {
//         linesArray = JSON.parse(localStorage.savedCanvas);
//         let lines = JSON.parse(localStorage.getItem("savedCanvas"));
//         for (let i = 1; i < lines.length; i++) {
//             ctx_dr.beginPath();
//             ctx_dr.moveTo(linesArray[i-1].x, linesArray[i-1].y);
//             ctx_dr.lineWidth  = linesArray[i].size;
//             ctx_dr.lineCap = "round";
//             ctx_dr.strokeStyle = linesArray[i].color;
//             ctx_dr.lineTo(linesArray[i].x, linesArray[i].y);
//             ctx_dr.stroke();
//         }
//         console.log("Canvas loaded.");
//     }
//     else
//     {
//         console.log("No canvas in memory!");
//     }
// }



//----------------------------------------------------
//----------------------------------------------------
// ERASER HANDLING
const eraser = ()=>
{
    currentSize = 50;
    currentColor = ctx_dr.fillStyle;
}


//----------------------------------------------------
//----------------------------------------------------
// GET MOUSE POSITION
const getMousePos = (canvas, ev)=>
{

    let ex = ev.pageX;
    let ey = ev.pageY;

    let px = 0;
    let py = 0;

    while (canvas)
    {
        px += canvas.offsetLeft;
        py += canvas.offsetTop;
        canvas = canvas.offsetParent;
    }


    //this is bull"#$#"%" code... 
    //i can't  fix the offset in the mouse
    let final_pos_x  = ex-px; // ((ex-px)*2) - 150;
    let final_pos_y  = ey-py; // ((ey-py)*2) - 155;

    return {x: final_pos_x ,y: final_pos_y};
}


//----------------------------------------------------
//----------------------------------------------------
// ON MOUSE DOWN
const mousedown = (canvas, evt)=>
{
    //let mousePos = getMousePos(canvas, evt);
    isMouseDown=true
    let currentPosition = getMousePos(canvas, evt);
    ctx_dr.moveTo(currentPosition.x, currentPosition.y);
    ctx_dr.beginPath();
    ctx_dr.lineWidth  = currentSize;
    ctx_dr.lineCap = "round";
    ctx_dr.strokeStyle = currentColor;


    // draw a single dot when click
    // console.log("mouse clicked");
    ctx_dr.beginPath();
    ctx_dr.arc(currentPosition.x, currentPosition.y, 1, 0, 2*Math.PI);
    ctx_dr.fill();
}



//----------------------------------------------------
//----------------------------------------------------
// ON MOUSE MOVE
const mousemove = (canvas, evt)=>
{

    if(isMouseDown)
    {
        let currentPosition = getMousePos(canvas, evt);
        ctx_dr.lineTo(currentPosition.x, currentPosition.y)
        ctx_dr.stroke();
        store(currentPosition.x, currentPosition.y, currentSize, currentColor);
    }
}




//----------------------------------------------------
//----------------------------------------------------
// STORE DATA
const store = (x, y, s, c)=>
{
    let line =
    {
        "x": x,
        "y": y,
        "size": s,
        "color": c
    }


    linesArray.push(line);
}


//----------------------------------------------------
//----------------------------------------------------
// ON MOUSE UP
const mouseup = (evt)=>
{
    isMouseDown=false;

    let currentPosition = getMousePos(canvas, evt);
    ctx_dr.lineTo(currentPosition.x, currentPosition.y)
    ctx_dr.stroke();
    store(currentPosition.x, currentPosition.y, currentSize, currentColor);

    store();
}






const initCanvas = () =>
{
    // INITIAL LAUNCH
    createCanvas();
    
    
    //----------------------------------------------------
    //----------------------------------------------------
    document.getElementById('eraser').addEventListener('click', eraser);
    //document.getElementById('clear').addEventListener('click', createCanvas);
    // document.getElementById('save').addEventListener('click', save);
    // document.getElementById('load').addEventListener('click', load);
    
    
    
    //----------------------------------------------------
    //----------------------------------------------------
    // DRAWING EVENT HANDLERS
    canvas.addEventListener('mousedown', function() {mousedown(canvas, event);});
    canvas.addEventListener('mousemove',function() {mousemove(canvas, event);});
    canvas.addEventListener('mouseup',mouseup);
}    




// // END STOLEN SECTION


