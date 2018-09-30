var crypto = require('crypto')
var getSign = 'absdafdgs80943h()*)&()#c'
var md5 = crypto.createHash('md5')
let _update = md5.update(getSign)
let _dis = md5.digest('hex')
console.log(_update)
console.log(_dis)