const intervalId = setInterval(() => {
  console.log('James');
}, 10);

setTimeout(() => {
  const promise = new Promise((resolve) => {
    console.log('Richard');
    resolve('Robert');
  });

  promise
      .then((value) => {
        console.log(value);

        setTimeout(() => {
          console.log('Michael');

          clearInterval(intervalId);
        }, 10);
      });

  console.log('John');
}, 10);

// На самом деле я думала что сперва добавляются в Timer setInterval (James) и 
// setTimeout (John). Node зашел в setTimeout, увидел Promis (Robert, Richard) и //отправил его в очередь в microtask. Увидел что промис вызывает setTimeout и отправил его в очередь наверх в Timer (Michael). Увидел clearInterval (James) и тут же его вывел. 
// То есть мой вариант был James, John, Robert, Richard, James, Michael.
// а он увидел promis, сразу его выполнил, затем вернулся на круг event loop, выполнил setTimeout и тд