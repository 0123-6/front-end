# git

```cmd
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 在当前目录初始化一个git仓库
git init
# 克隆
git clone url

# 获取最新的远程分支信息
git fetch origin

# 查看当前所在分支
git branch
# 查看远程所有分支
git branch -r

# 查看本地不存在的分支
git branch -r | grep -vE "$(git branch -lv | awk '{print $1}' | sed 's/^ */|/')"

# 获取某个具体的远程新分支
git checkout -b 新分支名 origin/新分支名

# 切换分支2.23之前版本
git checkout <branch-name>
# 切换分支2.23及之后版本
git switch <branch-name>

# 创建并切换到新分支2.23之前版本
git checkout -b <new-branch-name>
# 创建并切换到新分支2.23及之后版本
git switch -c <new-branch-name>


# 未提交的更改可能会阻止git pull
# 一次改动未完成,但是需要紧急修改其它bug,先暂存当前未完成的修改
git stash
# 恢复
git stash pop
# git stash支持多次暂存,可以查看列表
git stash list

# 拉取远程仓库的代码
# 如果要拉取的分支和当前分支不一样,会先拉取指定分支的最新代码,然后尝试将其合并到本地当前所在分支上.
git pull origin master

# 查看状态
git status

# 添加新文件到暂存区
git add new_file
# 添加当前目录所有文件到暂存区
git add .

# 提交代码到本地仓库
git commit -m '提交信息'

# 推送到远程
git push origin master
```

```bash
# 关闭git https校验
git config --global http.sslVerify "false"
git config --global http.sslVerify false
```

