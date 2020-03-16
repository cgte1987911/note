### 一、调整网卡

1. `vi /etc/sysconfig/network-scripts/ifcfg-ens33`    (其中ens33随着用户机器而不同)

   `ONBOOT=yes`

2. 保存退出 :wq

3. 重启 || 重启网络

   `systemctl restart network`

   centos8使用：

   `nmcli c reload`

   `nmcli c up （网络名称如：ens160）`

   

### 二、 用putty连接服务器(ssh客户端)



### 三、系统所有软件升级

	1.  \>yum update
 	2.  yum install net-tools     (其实就是安装ifconfig)
 	3.    yum install unzip vim wget -y





### 四、ip改成静态分配

​	1. 首先查看ip地址和网关：**ip a s**查看ip ;   **route -n**查看网关

 2. vi /etc/sysconfig/network-scripts/ifcfg-ens33    (其中ens33随着用户机器而不同)  

     修改如下：  

    * BOOTPROTO=static
    * IPADDR=192.168.117.187
    * NETMASK=255.255.255.0
    * GATEWAY=192.168.117.2

	3. 修改nds:

    * 可以修改vi /etc/resolve.conf
      * nameserver <网关>
    * 也可以直接使用命令nmcli connection modify 网络连接名称 +ipv4.dns 网关地址



五、安装nginx

1. 搜索nginx repo进入官网，复制以下repo

   ```properties
   [nginx]
   name=nginx repo
   baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
   gpgcheck=1
   enabled=1
   gpgkey=https://nginx.org/keys/nginx_signing.key
   module_hotfixes=true
   ```

2. `vi  /etc/yum.repos.d/nginx.repo`输入以上repo

3. `yum install nginx`

4. 启动nginx

   * `systemctl start nginx `    #启动
   * `systemctl enable nginx `   #开机启动

5. 开放端口：

   * 添加规则：`firewall-cmd --add-port=80/tcp --permanent`
   * 重载规则：`firewall-cmd --reload`  

6. 就能通过ip访问nginx首页

7. 修改nginx配置文件`vim /etc/nginx/nginx.conf` 

   * worker_preocess auto
   * 去掉# 号`#gzip  on`
   * 重载配置`nginx -s reload`

8. 站点配置` /etc/nginx/conf.d/*.conf`  



### 六、安装node.js

1. 方法一：

   1. 下载node
      * 找到“Linux Binaries (x64)”，复制地址
      * wget 地址
   2. 解压  `tar -xf node-v10.16.3-linux-x64.tar.xz`
   3. 移动
      * `mkdir -p /usr/local/lib/nodejs`
      * `mv node-v10.16.3-linux-x64 /usr/local/lib/nodejs`
      * 修改环境变量
        * `export PATH=/usr/local/lib/nodejs/node-v10.16.3-linux-x64/bin:$PATH`

2. 方法二：安装nvm

   * 打开https://github.com/nvm-sh/nvm/blob/master/README.md

   * 找到链接：  

     `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`

   * 使用nvm安装node相应版本

     *  nvm install 12
     * nvm use 12



### 七、安装redis

1. 安装依赖库`yum install tcl gcc make -y`

2. 下载源码包

   * 进官网->download->wget
   * `wget http://download.redis.io/releases/redis-5.0.8.tar.gz`

3. 解压`tar -zxf redis-5.0.8.tar.gz`

4. `cd redis-5.0.8/deps`

5. `make hiredis jemalloc lua linenoise`

6. `cd ..`

7. `make`

8. `make install`

9. `cd utils/`

10. 安装服务：`./install_server.sh`

    * 配置：

      * ```
        Please select the redis port for this instance: [6379]指定一个端口
        Selecting default: 6379
        Please select the redis config file name [/etc/redis/6379.conf]指定一个配置文件
        Selected default - /etc/redis/6379.conf
        Please select the redis log file name [/var/log/redis_6379.log]指定一个日志文件
        Selected default - /var/log/redis_6379.log
        Please select the data directory for this instance [/var/lib/redis/6379]指定磁盘文件的位置
        Selected default - /var/lib/redis/6379
        Please select the redis executable path [/usr/local/bin/redis-server] 可执行文件放哪里
        ```

11. 开机启动：`systemctl enable redis_6379`



### 八、安装mariadb

1. vim /etc/yum.repos.d/mariadb.repo

2. ```properties
   # MariaDB 10.4 CentOS repository list - created 2020-03-14 12:07 UTC
   # http://downloads.mariadb.org/mariadb/repositories/
   [mariadb]
   name = MariaDB
   baseurl = http://yum.mariadb.org/10.4/centos8-amd64
   module_hotfixes=1
   gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
   gpgcheck=1
   
   ```

3. ```bash
   sudo dnf install MariaDB-server
   sudo systemctl start mariadb
   ```

4. 配置文件

   * `1.mysqld --verbose --help | more`

   * `vim /etc/my.cnf`

     * ```properties
       [client-server]
       port=3306
       
       [mysqld]
       data=/var/lib/mysql/
       user=mysql
       log-basename=mysqld
       ```

5. 数据库初始化

   * `mysql_install_db`
   * `mysql_upgrade`

6. 启动mysql

   * `systemctl start mariadb`
   * `systemctl enable mariadb`

7. 数据库安装:`mysql_secure_installation`

   * ```
       >Switch to unix_socket authentication
        Y
       
       >Change the root password?
        随便
       
       >Remove anonymous users?
        Y
       
       >Disallow root login remotely?
        Y
       
       >Remove test database and access to it?
        Y
       
       >Reload privilege tables now?
        Y
     ```

8. 登录到数据库`mysql -uroot -p`

9. 导入数据库

   * 使用winscp软件传输文件
   * `mysql meituan -uroot < /root/meituan.sql`



### 九、配置redis集群

1. 克隆3台以上配置的原型机，然后修改ip(以131、132、133为例)

2. 在131机器上新建redis配置文件vim redis.conf（名字随意）

   * ```properties
     port 7000
     
     #关闭保护模式——不带密码启动
     protected-mode no
     
     #集群特性启用
     cluster-enabled yes
     
     #存储节点信息配置文件——所有节点会互相同步
     cluster-config-flie nodes.conf
     
     #存活时间——超过5s没有心跳自动删除节点并广播
     cluster-node-timeout 5000
     
     appendonly yes
     
     ```

3. `ps -ef|grep redis`   查看有没有redis进程开着有就用`kill -9 进程号`杀掉此进程

4. `redis-server ./redis.conf`就能通过新创建的配置文件来启动redis

5. 通过自动化脚本配置redis集群

   * 让ssh不需要密码：

     * `ssh-keygen`后面选项都直接回车
     * 所有和ssh相关的文件在`/root/.ssh/下
     * 分发公钥：
       * ssh-copy-id root@192.168.117.131
       * ssh-copy-id root@192.168.117.132
       * ssh-copy-id root@192.168.117.133

   * 在根目录下新建如下两个bash脚本：

     * redis.sh

       ```bash
       #!/usr/bin/env bash
       
       #在主控节点执行
       if [ ! $1 ]
       then
         echo 'command:' $0 '[cmd]'
         exit
       fi
       
       cmd=$1;
       
       if [ $cmd == 'initall' ]
       then
         for item in `cat server_list.txt`
         do
           echo init $item;
           scp redis_sh.sh root@$item:/root/;
       
           ssh root@$item '/root/redis_sh.sh init 7000';
           ssh root@$item '/root/redis_sh.sh init 7001';
         done
       
       elif [ $cmd == 'startall' ]
       then
         for item in `cat server_list.txt`
         do
           echo start $item;
       
           ssh root@$item '/root/redis_sh.sh start 7000';
           ssh root@$item '/root/redis_sh.sh start 7001';
         done
       
       elif [ $cmd == 'ps' ]
       then
         for item in `cat server_list.txt`
         do
           echo $item;
       
           ssh root@$item 'ps -ef | grep [r]edis';
         done
       
       
       elif [ $cmd == 'stopall' ]
       then
         for item in `cat server_list.txt`
         do
           echo stopall $item;
       
           ssh root@$item '/root/redis_sh.sh stopall';
         done
       
       elif [ $cmd == 'create' ]
       then
         servers=''
       
         for item in `cat server_list.txt`
         do
           servers+=$item:7000' ';
           servers+=$item:7001' ';
         done
       
         redis-cli --cluster create $servers --cluster-replicas 1
       
       elif [ $cmd == 'restartall' ]
       then
         $0 stopall
         $0 startall
       
       else
         echo no this command: $1
       
       fi
       
       ```

     * redis_sh.sh

       ```bash
       #!/usr/bin/env bash
       
       #在集群节点上执行
       root='/etc/redis';
       
       if [ ! $1 ]
       then
         echo 'command:' $0 '[cmd] [port]'
         exit
       fi
       
       cmd=$1;
       port=$2;
       
       conf_file=$root/$port/redis.conf;
       
       if [ $cmd == 'init' ]
       then
         if [ ! $2 ]
         then
           echo 'command:' $0 'init [port]'
           exit
         fi
       
         #
         rm -rf $root/$port;
         mkdir -p $root/$port;
       
         # create the conf
         echo port $port >> $conf_file;
         echo 'protected-mode no' >> $conf_file;
         echo 'cluster-enabled yes' >> $conf_file;
         echo 'cluster-config-file nodes.conf' >> $conf_file;
         echo 'cluster-node-timeout 5000' >> $conf_file;
         echo 'appendonly yes' >> $conf_file;
       
         echo 'init redis server @'$port 'success';
       
       elif [ $cmd == 'start' ]
       then
         if [ ! $2 ]
         then
           echo 'command:' $0 'start [port]'
           exit
         fi
       
         # set pwd
         cd $root/$port/
       
         # start server
         redis-server $conf_file 2>error.log 1>output.log & echo server @$port started;
       
         # firewall
         firewall-cmd --add-port=$port/tcp --permanent 2>1 > /dev/null;
         firewall-cmd --add-port=$((port+10000))/tcp --permanent 2>1 > /dev/null;
         firewall-cmd --reload 2>1 > /dev/null;
       
       elif [ $cmd == 'stopall' ]
       then
         # kill all redis-server
         pkill -e redis-server
       
       else
         echo no this command: $1
       
       fi
       
       ```

   * `chmod +x redis.sh redis_sh.sh`

   * vim server_list.txt

     ```
     192.168.117.131
     192.168.117.132
     192.168.117.133
     ```

   * `./redis.sh initall`

   * `./redis.sh startall`

   * `./redis.sh create`

   * `redis-cli -c -h 192.168.117.131 -p 7000`可以用集群的方式登录redis服务操作数据：

     * set name 'ltf'
     * get name

   



















​	   

​    



