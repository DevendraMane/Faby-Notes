const lcm = (a, b) => {
  const max = Math.max(a, b);
  for (let i = max; ; i++) {
    if (i % a === 0 && i % b === 0) {
      return i;
    }
  }
};
console.log(lcm(8, 6));
