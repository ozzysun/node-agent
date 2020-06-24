// --utils--------
const exec = (_path, cmdArray, callback = null) => {
  let index = 0
  const outArray = []
  const errArray = []
  const run = () => {
    if (index < cmdArray.length) {
      console.log(`run=${cmdArray[index]}`)
      exec(cmdArray[index], { cwd: _path }, (err, stdout, stderr) => {
        if (err != null) {
          if (callback !== null) callback(err, outArray.toString(), errArray.toString())
        } else {
          outArray.push(stdout)
          errArray.push(stderr)
          index++
          run()
        }
      })
    } else {
      if (callback !== null) callback(null, outArray.toString(), errArray.toString())
    }
  }
  run()
}
module.exports = { exec }
