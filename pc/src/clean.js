const fs = require("fs");
let path = "./";
let filess = fs.readdirSync(path);
// console.log("files", files);
const files = filess.filter(item => /.jsx/.test(item));
for (let i = 0; i < files.length; i++) {
  fs.readFile(`${path}/${files[i]}`, function(err, data) {
    console.log("data", data);
    // console.log(data.toString().split('\n')[0].split(' ')[1])
    // console.log(data.toString().split('\n')[1].split(' ')[1])
    // let newname =
    //   data
    //     .toString()
    //     .split('\n')[1]
    //     .split(' ')[1] +
    //   '-' +
    //   data
    //     .toString()
    //     .split('\n')[0]
    //     .split(' ')[1]
    //     .replace(/['|']/g, '');
    const names = files[i].split(".");
    let name = "";
    names.forEach((item, index) => {
      if (index !== names.length - 1) name += `${item}.`;
    });
    fs.rename(`${path}/${files[i]}`, `${path}/${name}js`);
  });
}
