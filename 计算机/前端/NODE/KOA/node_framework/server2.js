
let str='1.gif,3.ico,2.svg,'
let re=/^(\w+\.(jpe?g|png|gif|ico|svg),)+$/ig;
console.log(re.test(str));
//console.log(str.match(re))
