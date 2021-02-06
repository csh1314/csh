const { promisify } = require('util');
const path = require('path')

const download = promisify(require('download-git-repo'));

const { vueRepo } = require('../config/repo-config');
const { commandSpawn } = require('../utils/teminal');
const { compile, writeToFile, createDirSync } = require('../utils/util');




// callback -> promisify(函数) —> Promise -> async await
const createProjectAction = async (project) => {
    console.log("csh helps you create your project~")

    // 1.clone 项目
    await download(vueRepo, project, {clone: true});

    // 2.执行 npm install
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    await commandSpawn(command,['install'], {cwd: `./${project}`})
    
    // 3.运行 npm run serve
    commandSpawn(command, ['run', 'serve'], {cwd: `./${project}`});
    // 4.打开浏览器
}

// 添加组件的action
const addComponentAction = async (name, dest) => {
    // 1.有对应的ejs模板
    // 2.编译ejs模板得到 result
    const result = await compile("vue-component.vue.ejs", {name, lowerName:name.toLowerCase()});
    //console.log(result);
    // 3.将result写入到.vue文件中并放入对应的文件夹
    if(createDirSync(dest)){// 判断path是否存在,如果不存在，创建对应的文件夹
        const targetPath = path.resolve(dest, `${name}.vue`);
        writeToFile(targetPath, result);
    }
}

// 添加page(组件+路由)
const addPageAndRouteAction = async (name, dest) =>{
    // 1.编译ejs模板
    const data = {name, lowerName:name.toLowerCase()};
    const pageResult = await compile("vue-component.vue.ejs", data);
    const routeResult = await compile("vue-router.js.ejs", data);

    // 2.写入文件
    // 判断path是否存在,如果不存在，创建对应的文件夹
    if(createDirSync(dest)){
        const targetPagePath = path.resolve(dest, `${name}.vue`);
        const routePagePath = path.resolve(dest, `router.js`);
        writeToFile(targetPagePath, pageResult);
        writeToFile(routePagePath, routeResult);
    }
}

// 添加状态管理
const addStoreAction = async (name, dest) => {
    // 1.编译的过程
    const storeResult = await compile('vue-store.js.ejs',{});
    const typeResult = await compile('vue-types.js.ejs',{});

    // 2.创建文件
    if(createDirSync(dest)){
        const targetStorePath = path.resolve(dest,'index.js');
        const targetTypePath = path.resolve(dest,'types.js');
        writeToFile(targetStorePath,storeResult);
        writeToFile(targetTypePath,typeResult);
    }
}

module.exports = {
    createProjectAction,
    addComponentAction,
    addPageAndRouteAction,
    addStoreAction
}