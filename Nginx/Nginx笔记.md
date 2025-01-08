# Nginx

nginx位置/usr/local/nginx

## Nginx是什么

**Nginx**是一个开源的，高性能的HTTP服务器和反向代理服务器，也是IMAP/POP3/SMTP服务器。它使用了异步事件驱动的架构，可以处理大量的并发请求。因此在处理高并发，大流量的网站方面表现优秀。

Nginx的主要功能包括：

- 作为HTTP服务器，提供网页的HTTP服务,找到对应的html文件,可以通过nginx.conf自定义响应标头.
- 作为反向代理服务器，可以将请求转发到后端的服务器，并将后端服务器的响应返回给客户端，从而提高了服务器的安全性和负载能力。
- 提供负载均衡的功能，可以将请求分发到多个后端服务器，提高了系统的可用性和响应速度。
- 提供邮件代理服务，支持IMAP/POP3/SMTP协议。

**Nginx**广泛应用于网站的服务器，特别是高流量的网站。

## Nginx常用命令

```bash
# 开启Nginx
systemctl start nginx

# 停止Nginx
nginx -s stop

# 重新加载Nginx配置文件
nginx -s reload

# 测试Nginx配置文件是否有语法错误
nginx -t

# 显示nginx版本
nginx -v
```

## Brotli

**br压缩**是比**gzip压缩**更高效的方式，但**Nginx**默认没有这个功能，需要手动编译，再在**Nginx**中引入使用。

系统需要有**Nginx**软件。

```bash
apt install nginx
```

### 下载google/ngx_brotli

```bash
git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli
cd ngx_brotli/deps/brotli
mkdir out && cd out
cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF -DCMAKE_C_FLAGS="-Ofast -m64 -march=native -mtune=native -flto -funroll-loops -ffunction-sections -fdata-sections -Wl,--gc-sections" -DCMAKE_CXX_FLAGS="-Ofast -m64 -march=native -mtune=native -flto -funroll-loops -ffunction-sections -fdata-sections -Wl,--gc-sections" -DCMAKE_INSTALL_PREFIX=./installed ..
cmake --build . --config Release --target brotlienc
cd ../../../..
```

### 编译

在同目录下载并解压和Ubuntu系统中**Nginx**版本相同的**Nginx**源代码v1.18，其中一堆信息为nginx -V命令输出的配置，删除其中的绝对路径，要不然会报错。

```bash
wget https://nginx.org/download/nginx-1.26.2.tar.gz
tar -zxvf nginx-1.26.2.tar.gz

cd nginx-1.26.2
./configure 一堆信息 --with-compat --add-dynamic-module=../ngx_brotli
make modules
```

###配置Nginx

将编译生成的objs目录下的**ngx_http_brotli_filter_module.so**和**ngx_http_brotli_static_module.so**移动到**/usr/lib/nginx/modules/**目录下，在Nginx配置文件中添加如下配置：

```nginx
mv objs/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules
mv objs/ngx_http_brotli_static_module.so /usr/lib/nginx/modules

load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```

完整配置请查看文件**nginx.conf**。



## 如何卸载

```bash
# 1. 停止服务
systemctl stop nginx

# 2. 删除nginx
apt remove nginx nginx-common nginx-full

# 3. 删除残留的配置文件和依赖
apt purge nginx nginx-common nginx-full

# 4. 删除自动安装的依赖包
apt autoremove

# 5. 删除Nginx目录和文件
rm -rf /etc/nginx
rm -rf /var/log/nginx
rm -rf /var/www/html

# 6. 删除Nginx创建的用户
deluser --remove-home nginx
delgroup nginx

# 验证是否卸载成功
nginx -v
```

## 如何安装最新版Nginx

```bash
# 1. 安装依赖
apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring

# 2. 导入官方Nginx key
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null

# 3. 验证key
gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg

# 4. 设置apt
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
    
# 5. 设置使用新的apt配置
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | sudo tee /etc/apt/preferences.d/99nginx
    
# 6. 安装Nginx
apt update
apt install nginx

# 7. 验证是否安装成功，输出nginx version: nginx/1.26.2
nginx -v
```

## 如何支持HTTP/2

一行配置即可，参见nginx.conf。

## 如何支持HTTP/3

从1.25.0开始支持HTTP/3，测试失败，放弃。













































