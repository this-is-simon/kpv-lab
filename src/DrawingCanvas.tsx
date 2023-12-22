import "./slider.css";

export const DrawingCanvas = () => {
  //
  let isDrawing = false;
  let x = 0;
  let y = 0;

  const myPics = document.getElementById("myPics");
  //@ts-ignore
  const context: HTMLElement = myPics.getContext("2d") as HTMLElement;

  // event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

  // Add the event listeners for mousedown, mousemove, and mouseup
  //@ts-ignore
  myPics.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
  });

  //@ts-ignore
  myPics.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      drawLine(context, x, y, e.offsetX, e.offsetY);
      x = e.offsetX;
      y = e.offsetY;
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      drawLine(context, x, y, e.offsetX, e.offsetY);
      x = 0;
      y = 0;
      isDrawing = false;
    }
  });

  //@ts-ignore
  function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  }
  //
  return <canvas id="myPics" width="560" height="360" />;
};
