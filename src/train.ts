// ZE task

function removeDuplicate(str: string): string{
    let result = '';
    for (let char of str){
        if(!result.includes(char)){
            result += char;

        }
    }
    return result;
   }
console.log(removeDuplicate('string'));

// ZD task

/*
function changeNumberInArray(index: number, arr: number[], newValue: number): number[]{
        if(index >= 0 && index < arr.length){
            arr[index] = newValue;
     }
        return arr;
    }
    console.log(changeNumberInArray(1,[1, 3, 7, 2], 2));
    */

// ZC task

/*
function celsiusToFahrenheit(num: number): number {
  return (num * 9) / 5 + 32;
}
console.log(celsiusToFahrenheit(0));
*/

// ZA task

  /*
  function sortByAge(arr:{age: number}[]): {age: number}[] {
    return arr.sort((a, b)=> a.age - b.age)
    }
  
    console.log(sortByAge([{age:23}, {age:21}, {age:13}]));
    */


// Z task
  
  /*
  function sumEvens(arr:number[]): number {
    return arr.filter(num => num % 2 === 0).reduce((acc, curr)=> acc + curr, 0);
  }

  console.log(sumEvens([1 , 2, 3, 2]))
  */

// Y task

/*
  function findIntersection(arr1: number[], arr2: number[]): number[]{
    return arr1.filter((value)=> arr2.includes(value));
  }

  console.log(findIntersection([1, 2, 3], [3, 2, 0]))
  */

// X task

/*
function countOccurrences(obj:any, key: string): number{
  let count = 0;
  function search(current : any){
    if(typeof current === 'object' && current !== null){
        for (let k in current){
            if (k === key) count ++;
            search(current[k]);
        }
    }
  }
  search(obj);
  return count;
  }

  const data = {
    model : 'Bugatti',
    steer: {
        model: 'HANKOOK',
        size: 30
    }
  }
  console.log(countOccurrences(data, 'model'));
  */

// W task

/*
function chunkArray<T>(arr: T[], size: number): T[][]{
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3))
*/

// V task

/*
function countChars(str: string): Record<string, number>{
    const result: Record<string, number> ={};

    for (const char of str) {
        result[char] = (result[char] || 0) + 1;
    }
    return result;
}
console.log(countChars("gambaree"))
*/

// U task

/*
function sumOdds(n: number):number{
let count = 0;

for (let i = 1; i < n; i += 2){
    count++
}
return count;

}
console.log(sumOdds(9));
*/

// T task

/*
function mergeSortedArrays(arr1: number[], arr2: number[]): number[]{
    const merged = [...arr1, ...arr2];
    return merged.sort((a, b)=> a-b);
}
console.log(mergeSortedArrays([0, 3 , 4, 31], [4, 6, 30]));
*/

// S task

/*
function missingNumber(arr: number[]): number{
    const n : number = arr.length;
    const expectedSum: number = (n * (n+1)) /2;
    const actualSum: number = arr.reduce((acc, num)=> acc + num, 0);
    return expectedSum - actualSum;
}
console.log(missingNumber([3,0,1]));
*/

// R task

/*
function calculate(expression: string): number{
    const [a, b] = expression.split("+").map(Number);
    return a + b;
}

console.log(calculate("45+55"));
*/

// Q task

/*
function hasProperty(obj: object, key: string): boolean {
    return Object.keys(obj).includes(key);
}

console.log(hasProperty({name: "BMW", model: "M3"}, "model"));
console.log(hasProperty({name: "BMW", model: "M3"}, "year"));
*/

// P task

/*
function objectToArray(obj: Record<string, any>): [string, any][]{
    return Object.keys(obj).map(key=>[key, obj[key]]);
}

console.log(objectToArray({ a: 10, b:20}));
*/

// O task

/*
function calculateSumOfNumbers(arr: any[]): number {
    let sum = 0;

    for (const item of arr) {
        if(typeof item === "number"){
            sum += item;
        }
    }

    return sum;
}
console.log(calculateSumOfNumbers([10, "10", {son: 10}, true, 35]));
*/


// N task

/*
function palindromCheck(word: string): boolean {
  const reversed = word.split('').reverse().join('');
  return word === reversed;
}
console.log(palindromCheck("aka"));  
console.log(palindromCheck("uka"));   
*/


// M task

/*
function getSquareNumbers(numbers: number[]): {
    number: number , square: number }[]{
    return numbers.map(num=>({
        number: num,
        square: num * num
    }))
}
console.log(getSquareNumbers([1,2, 3]))
*/

/* Validations:
Frontend validation
Backend validation
Database validation
*/ 

// L task

/*
function reverseSentence(sentence:string):string{
return sentence
.split(" ")
.map(word=>word.split("").reverse().join(""))
.join(" ");
}
console.log(reverseSentence("we like coding"));
*/

// K task

/* 
function countVowels(s: string): number {
    const vowels = "aeiouAEIOU";
    return s.split("").filter(char=>vowels.includes(char)).length;
}
console.log(countVowels("string"));
*/


// J task

/*
function findLongestWord(sentence: string): string {
    const words = sentence.split(" ");
    let longestWord = "";

    for (let word of words) {
        if (word.length > longestWord.length){
            longestWord = word;
        }
    }
    return longestWord;
}
console.log(findLongestWord("I come from Uzbekistan!"));
*/




/*
Traditional Frontend Development => BSSR  (Admin)=> EJS
Modern Frontend Development      => SPA (User application) => REACT
*/




// I task

/*
function majorityElement(arr:number[]):number|null{
    const countMap = new Map<number, number>();

    for (let num of arr){
        countMap.set(num, (countMap.get(num)||0) + 1);
    }

    return [...countMap.entries()].reduce((a,b)=>(b[1]>a[1]? b : a))[0]
}
console.log(majorityElement([1, 2, 3, 4, 5, 4, 3, 4]))
*/



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