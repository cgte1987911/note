1.下载完压缩包之后就解压，再创建一个同级空目录mysqlData，再进入mysql8.0.15安装根目录创建一个my.ini配置文件。

```ini
[mysqld]
# 设置3306端口
port=3306

# 自定义设置mysql的安装目录，即解压mysql压缩包的目录
basedir=E:\MySQL\mysql-8.0.15-winx64

# 自定义设置mysql数据库的数据存放目录
datadir=E:\MySQL\mysqlDate

# 允许最大连接数
max_connections=200

# 允许连接失败的次数，这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10

# 服务端使用的字符集默认为UTF8
character-set-server=utf8

# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB

# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password

[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8

[client]
# 设置mysql客户端连接服务端时默认使用的端口和默认字符集
port=3306
default-character-set=utf8
```

2.之后进入安装目录的bin目录，初始化数据库，输入命令`mysqld --initialize --console`回车。
 使用cmd切换到mysql安装根目录下的bin目录，切记要用管理员身份运行。切换指定路径的方法也在截图中。



### 3.记住屏幕上给出的初始密码后面要用到



4.输入mysqld  --install  [服务名]  来安装mysql服务



5.net start [服务名]  来启动mysql服务

6.mysql -u root -p  进入mysql指令界面

7修改密码

```mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';
```



8.把mysql的bin目录加入环境变量方便每次启动服务