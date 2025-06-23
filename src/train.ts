// H task

// H task
function getPositive(arr: number[]): string {
  return arr
    .filter((num: number): boolean => Number.isInteger(num) && num > 0)
    .map((num: number): string => num.toString())
    .join("");
}
console.log(getPositive([1, -4, 2]));



// G task

/*
function getHighestIndex(arr: number[]): number{
    if(arr.length === 0) return -1

    let maxVal: number = arr[0];
    let maxIndex: number = 0;

    for (let i = 1; i < arr.length; i++){
        if (arr[i] > maxVal){
         maxVal = arr[i];
         maxIndex = i ;
        }
    }

    return maxIndex
}

console.log(getHighestIndex([5, 21, 12, 21, 8]))
*/