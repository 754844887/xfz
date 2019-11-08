# 基于django2， python3开发的网站应用，仅用于学习django
# 主要功能包括新闻页面轮播图，集成百度富文本编辑器等


# nginx + uwsgi部署方法
1、环境准备
yum -y install mysql  # 安装mysql
yum -y install memcached # 安装memcached
yum -y install nginx # 安装nginx
yum -y install git  # 安装git

# 安装Python3
yum -y groupinstall "Development tools"
yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel
yum install libffi-devel -y
wget https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tar.xz
tar -xvJf  Python-3.7.0.tar.xz
mkdir /usr/local/python3 #创建编译安装目录
cd Python-3.7.0
./configure --prefix=/usr/local/python3
make && make install

# 安装python虚拟环境包
pip install virtualenv -i https://pypi.tuna.tsinghua.edu.cn/simple/
pip install virtualenvwrapper -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 安装uwsgi
pip install uwsgi

# 创建python虚拟环境
cd -- # 切换到用户家目录下
vi .bashrc # 打开用户环境变量配置文件加入如下两行
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/python3.7/bin/virtualenvwrapper.sh
source .bashrc # 更改完成执行生效

-----------------------------------
# python虚拟环境常用操作
mkvirtualenv 名称  # 创建
workon 名称  # 激活虚拟环境
deactivate  # 退出虚拟环境
rmvirtualenv 名称  # 删除虚拟环境
------------------------------------

# 创建python虚拟环境
mkvirtualenv myweb # 虚拟环境目录在$HOME/.virtualenvs下

# 获取python源码
cd /src
git clone https://github.com/754844887/xfz.git

# 安装依赖库
workon myweb
pip install -r /src/xfz/requirements.txt

2、部署
### 修改settings.py 配置文件 ###

# 注释settings.py中的如下配置
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'front', 'dist')
]

# 关闭debug
DEBUG = False

# 添加主机，此处添加为部署机的ip地址即可
ALLOWED_HOSTS = ['192.168.0.32']

# 配置数据库
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'xfz',
        'HOST': '192.168.0.32',
        'PORT': '3306',
        'USER': 'root',
        'PASSWORD': '123456789'
    }
}

# 增加如下配置
STATIC_ROOT =  os.path.join(BASE_DIR, 'static'） # 静态文件存放于此


#############################
### 修改uwsgi.ini配置文件 ###
#############################
vi conf/uwsgi.ini

# mysite_uwsgi.ini file
[uwsgi]

# Django-related settings
# the base directory (full path)
# 项目路径
chdir = /home/myweb/xfz

# Django's wsgi file
# django 的  wsgi.py 文件路径
module = xfz.wsgi

# the virtualenv (full path)
# 虚拟环境路径
virtualenv = /root/.virtualenvs/django-env

# process-related settings
# master
master = true

# maximum number of worker processes
processes = 10

# the socket (use the full path to be safe
socket = 127.0.0.1:8000
# ... with appropriate permissions - may be needed
# chmod-socket = 664
# clear environment on exit
vacuum = true


#logto = /tmp/mylog.log

# save uwsgi's status 保存uwsgi的运行状态
stats=%(chdir)/conf/uwsgi.status
# from restart/stop uwsgi 保存uwsgi的运行进程号
pidfile=%(chdir)/conf/uwsgi.pid



#########################
### 修改nginx配置文件 ###
#########################
vi conf/xfz_nginx.conf
# the upstream component nginx needs to connect to
upstream django {
# server unix:///path/to/your/mysite/mysite.sock; # for a file socket
server 127.0.0.1:8000; # for a web port socket (we'll use this first)
}
# configuration of the server

server {
# the port your site will be served on
listen 8089;
# the domain name it will serve for
#server_name www.long-road.cn; # substitute your machine's IP address or FQDN 远端的域名
#server_name 188.131.242.174/ #你的远端服务器ip;
charset utf-8;

# max upload size
client_max_body_size 75M; # adjust to taste

# Django media
location /media {
alias /home/myweb/xfz/media; # 指向django的media目录
}

location /static {
alias /home/myweb/xfz/static; # 指向django的static目录
}

# Finally, send all non-media requests to the Django server.
location / {
uwsgi_pass django;
include uwsgi_params; # the uwsgi_params file you installed
}
}


##################
### 生成表结构 ###
##################
python manage.py collectstatic # 复制静态文件到static目录
python manage.py migrate # 迁移数据库生成表结构（必须先在数据库中创建库）
python manage.py initgroup # 生成默认的权限组（必须在创建用户前执行）
python manage.py createsuperuser # 创建超级用户

################
### 启动项目 ###
################
ln -s conf/xfz_nginx.conf /etc/nginx/conf.d/ # 链接配置文件到nginx目录下
service nginx start # 启动nginx
uwsgi -i uwsgi.ini # 启动uwsgi 
