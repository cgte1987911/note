常用命令

1. 传输文件scp：`scp a.txt root@192.168.117.131:/root/`
2. 远程执行命令：`ssh root@192.168.117.131 'rm /root/a.txt -f'`
3. 让ssh不需要密码：
   * `ssh-keygen`后面选项都直接回车
   * 所有和ssh相关的文件在`/root/.ssh/下
   * 分发公钥：`ssh-copy-id root@192.168.117.131`
4. bash shell编程里面$0代表命令本身，$1代表第一个参数，一次类推