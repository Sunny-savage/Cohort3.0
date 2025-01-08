export function random(num: number) {
  let stir = "sjfkjdkfj93849375nirehie4r4dkjfkjfkdjkejrgkrjd948938";
  let length = stir.length;
  let ans: string = "";
  for (let i = 0; i <num; i++) {
    ans += stir[Math.floor(Math.random() * length)];
  }

  return ans;
}
