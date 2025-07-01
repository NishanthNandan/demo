// var b=10;
// console.log(b);

// function outfun(){
//   console.log(a);
//     var a=5;
// }
outerfun();
function outerfunction() {

console.log(a);

var a = 25;



innerfunction();



function innerfunction() {

console.log(a);

console.log(window.a);

console.log(this.a)

}

}



var a = 5;

var b =6



outerfunction();