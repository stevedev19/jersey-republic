// I task

function majorityElement(arr:number[]):number|null{
    const countMap = new Map<number, number>();

    for (let num of arr){
        countMap.set(num, (countMap.get(num)||0) + 1);
    }

    return [...countMap.entries()].reduce((a,b)=>(b[1]>a[1]? b : a))[0]
}
console.log(majorityElement([1, 2, 3, 4, 5, 4, 3, 4]))



/* Project Standards:
- Logging standards
- Naming standards:
function, method, variable = CAMEL
class = PASCAL
folder, file = KEBAB
CSS => SNAKE
- Error handling
*/

/*
Traditional API
Rest API
GraphQL API
...
*/




// H-2 task

/*
function getDigits(str: string): string {
  return str
    .split("")
    .filter(char => /\d/.test(char)) 
    .join("");
}
console.log(`"${getDigits("m29i1t")}"`);
*/

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