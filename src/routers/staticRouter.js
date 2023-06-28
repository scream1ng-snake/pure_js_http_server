const Router = require('../../framework/Router.js');
const fs = require('fs');
const path = require('path');

const staticPath = process.cwd() + '/client'

/** Роутер для раздачи статики */
const router = new Router('статика');

/** Урлы, по которым будет отдаваться статика */
const staticUrls = [];

/** Чекаем папку со статикой и собираем урлы */
checkFiles();

/** Забиваем роут для каждого урла со статикой */
staticUrls.forEach((url) => {
  router.get('/' + url, (req, res) => {
    const file = fs.readFileSync(path.join(staticPath, url))
    if (file?.length) {
      const extension = url.split('.')[url.split('.').length - 1]
      res.setHeader('Content-type', 'text/' + extension)
      res.write(file)
      res.end()
    } else {
      res.statusCode = 404
      res.end(JSON.stringify('File not found'))
    }
  })
})

module.exports = router;

function checkFiles(parentUrl) {
  const undefParentUrl = parentUrl?.length
    ? parentUrl
    : ''
  
  const viewingPath = path.join(
    staticPath,
    undefParentUrl
  )

  fs.readdirSync(viewingPath)
    .forEach((filename) => {
      const isFolder = fs
        .lstatSync(path.join(viewingPath, filename))
        .isDirectory()

      const isFile = fs
        .lstatSync(path.join(viewingPath, filename))
        .isFile()

      if (isFile) {
        staticUrls.push(path.join(undefParentUrl, filename))
      }
      if (isFolder) {
        checkFiles(path.join(undefParentUrl, filename))
      }
    })
}