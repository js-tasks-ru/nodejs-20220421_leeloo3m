function sum(a, b) {

  if (typeof a == "number" && typeof b == "number") {
    return a + b;
  } else {
    
    throw new TypeError("аргументы не являются числами");
  }
  
  
}

module.exports = sum;
