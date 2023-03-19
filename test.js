// NotArrayError 繼承 TypeError的 properties and method
class NotArrayError extends TypeError {
  constructor(message) {
    super(message);

    // 設定 NotArrayError 的 instance properties
  }

  // 設定 NotArrayError 的 instance methods
  printSolution() {
    return "確定參數為array後，再執行程式碼";
  }
}

function sumArray(arr) {
  if (!Array.isArray(arr)) throw new NotArrayError('parameter is not "array"');
  let sum = 0;
  arr.forEach((element) => {
    sum += element;
  });
  return sum;
}

try {
  sumArray("hi");
} catch (e) {
  console.log(e.printSolution()); // 確定參數為array後，再執行程式碼
  console.log(e); // NotArrayError [TypeError]: parameter is not "array"
}
