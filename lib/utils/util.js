const path = require('path');
const { promisify } = require('util');
const fs = require('fs');

const ejs = require('ejs');


// 编译ejs模板
const renderFilePromise = promisify(ejs.renderFile); //转promise
const compile = (templateName, data) => {
    const templatePosition = `../templates/${templateName}`;
    const templatePath = path.resolve(__dirname, templatePosition);
    return renderFilePromise(templatePath, { data }, {}).then(res=>{
        return Promise.resolve(res);
    }).catch(err=> console.log(err))
}

// 创建文件夹（未找到指定路径时） source/components/category
const createDirSync = (pathName) => {
    if(fs.existsSync(pathName)) {
        return true;
    } else {// path.dirname(pathName))  当前路径pathName的父路径
        if(createDirSync(path.dirname(pathName))){
            fs.mkdirSync(pathName);
            return true;
        }
    }
}

// 写入文件
const writeToFile = (path, content) => {
    return fs.promises.writeFile(path, content);
}

module.exports ={
    compile,
    writeToFile,
    createDirSync
}