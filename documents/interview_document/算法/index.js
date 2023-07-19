var minNumber = function (nums) {
  let str = "";
  for (let i = 0; i < nums.length; i++) {
    if (nums[i]?.length > 1) {
      nums[i] = [nums[i]];
      nums[i] = nums[i].sort((a, b) => a - b);
      nums[i] = nums[i].join("");
    }
    str = `${str}${nums[i]}`;
  }
  return str;
};

minNumber([3, 30, 34, 5, 9]);
