const canvas = document.querySelector("canvas"),
FillColor = document.getElementById("FillColor"),
toolBtn = document.querySelectorAll(".tool"),
ctx = canvas.getContext("2d");
const clear = document.querySelector(".ClearCanvas");
const BrushSize = document.querySelector("#SizeSlider");
const Colors = document.querySelectorAll(".MyColors .option");
const ColorPicker = document.querySelector("#ColorPicker");
const SaveImg = document.querySelector(".SaveImg");

// Global variables with default values
let PrevMouseX, PrevMouseY;
let isDrawing = false,
    SelectedTool = "brush",
    SelectedColor = "#000";

window.addEventListener("load", () => {
    // Set the canvas resolution 
    canvas.width = 800;
    canvas.height = 500;
    ctx.strokeStyle = SelectedColor; // set the initial stroke color
    ctx.fillStyle = SelectedColor; // set the initial fill color
    ctx.lineWidth = 5; // Default line width
});

// Function to draw Rectangle
const DrawRect = (e) => {
    let width = e.offsetX - PrevMouseX;
    let height = e.offsetY - PrevMouseY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(canvasImage, 0, 0);
    if (!FillColor.checked) {
        return ctx.strokeRect(PrevMouseX, PrevMouseY, width, height);
    }
    ctx.fillRect(PrevMouseX, PrevMouseY, width, height);
}

// Function to Draw circle
const DrawCircle = (e) => {
    ctx.beginPath();
    let Radius = Math.sqrt(Math.pow((PrevMouseX - e.offsetX), 2) + Math.pow((PrevMouseY - e.offsetY), 2));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(canvasImage, 0, 0);
    ctx.arc(PrevMouseX, PrevMouseY, Radius, 0, 2 * Math.PI);
    FillColor.checked ? ctx.fill() : ctx.stroke();
}

// Function to Draw Triangle
const DrawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(PrevMouseX, PrevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(PrevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(canvasImage, 0, 0);
    FillColor.checked ? ctx.fill() : ctx.stroke();
}

// Start drawing when mouse is down
const StartDraw = (e) => {
    isDrawing = true;
    PrevMouseX = e.offsetX;
    PrevMouseY = e.offsetY;
    canvasImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = SelectedColor;
    ctx.fillStyle = SelectedColor;
    ctx.lineWidth = BrushSize.value; // Ensure line width is from the slider
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
};

// Draw as the mouse moves
const Drawing = (e) => {
    if (!isDrawing) return;

    // Set the stroke style to eraser color if eraser is selected
    if (SelectedTool === "eraser") {
        ctx.strokeStyle = "#fff"; // Assuming white background for erasing
    } else {
        ctx.strokeStyle = SelectedColor;
    }

    if (SelectedTool === "brush" || SelectedTool === "eraser") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (SelectedTool === "rectangle") {
        DrawRect(e);
    } else if (SelectedTool === "circle") {
        DrawCircle(e);
    } else if (SelectedTool === "triangle") {
        DrawTriangle(e);
    }
};

// Stop drawing when the mouse is released
const StopDraw = () => {
    isDrawing = false;
    ctx.closePath();
};

// Tool selection
toolBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        SelectedTool = btn.id;
        console.log(SelectedTool);
    });
});

// Brush size adjustment
BrushSize.addEventListener('change', () => ctx.lineWidth = BrushSize.value);

// Color selection
Colors.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        SelectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Color picker event
ColorPicker.addEventListener('change', () => {
    ColorPicker.parentElement.style.background = ColorPicker.value;
    ColorPicker.parentElement.click();
});

// Canvas mouse events
canvas.addEventListener("mousedown", StartDraw);
canvas.addEventListener("mousemove", Drawing);
canvas.addEventListener("mouseup", StopDraw);
canvas.addEventListener("mouseout", StopDraw); // Stop drawing if mouse leaves the canvas

// Clear the canvas
clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save Image
SaveImg.addEventListener('click', () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})