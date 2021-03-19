const express = require('express')
const app = express()
const port = 3002
const fs = require('fs')
const { exec } = require("child_process");
var multer = require('multer')
app.use(require('cors')())
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
var upload = multer({ storage: storage })

app.post('/api/', upload.single('file'), (req, res) => {
    var time = new Date().getTime();
    var outputFile = `${time}_output.txt`
    var image = req.file.path;
    if (!fs.existsSync(image)) {
        return res.send({ status: false, error: 'image is not uploaded' });
    }

    exec(`Release\\ConsoleDemo.exe "${image}" ${outputFile}`, (error, stdout, stderr) => {
        try {
            fs.unlinkSync(image);

            if (error) {
                res.send({ success: false, error: error, stdout: stdout, stderr: stderr })
                return
            }
            if (fs.existsSync(outputFile)) {
                var txt = fs.readFileSync(outputFile, 'utf-8');
                try {
                    // txt = JSON.parse(txt)
                    // txt = JSON.stringify(txt, null, 2)

                } catch (e) { }
                fs.unlinkSync(outputFile);
                // res.send({ success: true, data: txt })
                res.send(`<pre>${txt}</pre>`)
            } else {
                res.send({ success: false })
            }
        } catch (error) {
            res.send({ success: false, error: error })
        }
    })

})

app.use(express.static(__dirname + '/public'));

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`)
})