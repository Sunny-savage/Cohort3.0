function even(a) {
  if (a % 2 == 0) {
    return a;
  } else {
    return false;
  }
}

function map1(array, fun) {
  let arr1 = [];
  for (let i = 0; i < array.length; i++) {
    let result = fun(array[i]);
    if (result) {
      arr1.push(result);
    }
  }
  return arr1;
}

let dfs = [2, 3, 4, 5];

const asn = map1(dfs, even);
console.log(asn);
