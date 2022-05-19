/* function foo (enable) {
    enable = enable === undefined ? true : enable
    console.log(enable)
} */

function foo (enable=true) {
    console.log(enable)
}
foo()