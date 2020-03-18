一、反向代理配置

* `vim /etc/nginx/conf.d/default.conf`

* 增加一个location

  ```properties
  location /api {
    proxy_pass  http://127.0.0.1:8080$uri;
  }
  ```

* `nginx -s reload`

* 配置selinux打开网络连接：`setsebool http_can_network_connect true`

  

