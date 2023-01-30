function coin(N) {
    const coins = [1, 2, 5, 10];
    let total = 0;
    let result = [];

    // 依照日常生活常识，找零是从大向小查找
    for (let i = coins.length; i >= 0; i--) {
        let coin = coins[i];
        while (total + coin <= N) {
            result.push(coin);
            total += coin;
        }
    }
    return result;
}
console.log(coin(23)) // [ 10, 10, 2, 1 ] 