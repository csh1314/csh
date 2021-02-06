const program = require('commander');

const helpOptions = () =>{
    // 添加自己的options
    program.option('-c --csh', 'a csh cli');
    program.option('-d --dest <dest>','a destination folder, 例如：-d /src/components');
    program.option('-f --framework','your framework')
    
    program.on('--help', function(){
        console.log(" ");
        console.log("Other:");
        console.log("  other options~");
    })
}

module.exports = helpOptions;