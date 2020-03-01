### 1.安装cnpm

npm install -g cnpm --registry=https://registry.npm.taobao.org



### 2.卸载

npm un XXXX     卸载xxx模块



### 3.安装依赖

npm i  XXX  --save或者npm i  XXX   -S

npm i  XXX   -D



### 4.

在 package.json 文件里面提现出来的区别就是，使用 --save-dev 安装的 插件，被写入到 devDependencies 对象里面去，而使用 --save 安装的插件，责被写入到 dependencies 对象里面去。
如果你将包下载下来在包的根目录里运行

npm install 默认会安装两种依赖，如果你只是单纯的使用这个包而不需要进行一些改动测试之类的，可以使用
npm install --production 只安装dependencies而不安装devDependencies。