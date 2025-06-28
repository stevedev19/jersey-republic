/* Project Standards:
- Logging standards
- Naming standards:
function, method, variable = CAMEL
class = PASCAL
folder, file = KEBAB
CSS => SNAKE
- Error handling
*/

// H-2 task

function getDigits(str: string): string {
  return str
    .split("")
    .filter(char => /\d/.test(char)) 
    .join("");
}
console.log(`"${getDigits("m29i1t")}"`);

// H task

/*
function getPositive(arr: number[]): string {
  return arr
    .filter((num: number): boolean => Number.isInteger(num) && num > 0)
    .map((num: number): string => num.toString())
    .join(',');
}
console.log(`"${getPositive([7, -18, 9])}"`);
*/




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