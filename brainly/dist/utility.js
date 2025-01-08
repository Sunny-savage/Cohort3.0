"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(num) {
    let stir = "sjfkjdkfj93849375nirehie4r4dkjfkjfkdjkejrgkrjd948938";
    let length = stir.length;
    let ans = "";
    for (let i = 0; i < num; i++) {
        ans += stir[Math.floor(Math.random() * length)];
    }
    return ans;
}
