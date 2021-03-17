const fs = require('fs')

var txt = fs.readFileSync('1615936316977_output.txt', 'utf-8');
try { txt = JSON.parse(txt) } catch (e) {
    console.log(e)
}