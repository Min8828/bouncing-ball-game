const canvas = document.getElementById("myCanvas");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
const ctx = canvas.getContext("2d");
let circleX = 160;
let circleY = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let groundX = 100;
let groundY = 500;
let groundWidth = 150;
let groundHeight = 5;
let brickArray = [];
let countHitBricks = 0;

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    // if true => touch; else => not touch
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

// 返回一個介於 min ~ max 的整數
function getRandomArbitrary(min, max) {
  // Math.floor(Maht.random() * (max - min) => [min, max)
  return min + Math.floor(Math.random() * (max - min));
}

// 製作 all of bricks
/**
 *  0 <= x <= 950
 *  0 <= y <= 550
 */
createBricks();
function createBricks() {
  let overlapping = false;
  let newX;
  let newY;

  // 確定 new Brick 位置不會 跟 brickArray裡的 bricks 重疊
  function checkOverlap(newX, newY) {
    for (let i = 0; i < brickArray.length; i++) {
      if (
        newX >= brickArray[i].x - 50 &&
        newX <= brickArray[i].x + 50 &&
        newY >= brickArray[i].y - 50 &&
        newY <= brickArray[i].y + 50
      ) {
        overlapping = true;
        return;
      } else {
        overlapping = false;
      }
    }
  }

  for (let i = 0; i < 10; i++) {
    // overlapping is true, 重新設定 new brick 的位置
    do {
      newX = getRandomArbitrary(0, 950);
      newY = getRandomArbitrary(0, 550);
      checkOverlap(newX, newY);
    } while (overlapping);
    new Brick(newX, newY);
  }
}

canvas.addEventListener("mousemove", (e) => {
  groundX = e.clientX;
});

function drawCircle() {
  // 確認球是否打到磚塊
  brickArray.forEach((brick, index) => {
    //  磚塊是visible && 已經確認會打到磚塊，改變 x, y 方向速度
    if (brick.visible && brick.touchingBall(circleX, circleY)) {
      countHitBricks++;
      console.log(countHitBricks);
      brick.visible = false;
      // 左邊 or 右邊
      if (circleX <= brick.x || circleX >= brick.x + brick.width) xSpeed *= -1;
      // 上邊 or 下邊
      else if (circleY <= brick.y || circleY >= brick.y + brick.height)
        ySpeed *= -1;

      // 將 brick 從 brickArray 中移除 (2種 )
      /**
       * brickArray.splice(index, 1); // O(n) => 比較不好
       *
       * if (brickArray.length == 0) {
       *   clearInterval(game);
       *   alert("遊戲結束");
       * }
       */

      // better => 不須改變 brickArray
      if (countHitBricks == 10) {
        clearInterval(game);
        alert("遊戲結束");
      }
    }
  });

  // 確認球是否打到紅色地板，if yes => 改變 y 方向
  if (
    circleX >= groundX - radius &&
    circleX <= groundX + groundWidth + radius &&
    circleY >= groundY - radius &&
    circleY <= groundY + groundHeight + radius
  ) {
    // 避免下一幀的 circleY 還是落在打到紅色地板的範圍
    if (ySpeed > 0) {
      // 球往下，球落在地板上面 => 下一幀 circleY 位置比原先高 20
      circleY -= radius;
    } else {
      // 球往上，球落在地板下面 => 下一幀 circleY 位置比原先低 25 (5 + 20)
      circleY += groundHeight + radius;
    }
    ySpeed *= -1;
  }

  //確認球是否打到邊界
  // 左邊 or 右邊
  if (circleX <= radius || circleX >= canvasWidth - radius) xSpeed *= -1;
  // 上邊 or 下邊
  else if (circleY <= radius || circleY >= canvasHeight - radius) ySpeed *= -1;

  // 更動 circle 的座標
  circleX += xSpeed;
  circleY += ySpeed;

  // draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // draw all of bricks, if they are visible
  brickArray.forEach((brick) => {
    if (brick.visible) brick.drawBrick();
  });

  // draw circle (x, y, radius, startAngle, endAngle)
  // 360度 = 2 * Math.PI
  ctx.beginPath();
  ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.fill();

  // draw ground (x, y, width, height)
  ctx.fillStyle = "red";
  ctx.fillRect(groundX, groundY, groundWidth, groundHeight);
}

let game = setInterval(drawCircle, 25);
