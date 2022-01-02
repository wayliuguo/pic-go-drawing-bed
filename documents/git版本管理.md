## e572364 (HEAD -> master) 第一次提交1. 起步

```
git
git --version

// 配置
git config -l git config --list
git config user.name "well"
git config user.emial "1085550655@qq.com"

// 日志
git log 
git show <id>
git diff id \ id
```

## 2. 基本的Git概念

### 2.1 基本概念

#### 2.1.1 版本库

在版本库中，Git维护两个主要的数据结构：对象库（object store）和索引（index）。所有这些版本库数据存放在工作目录根目录 下一个名为.git 的隐藏子目录中。

#### 2.1.2 git对象类型

**包含：**

- 原始数据文件和所有日志消息
- 作者信息
- 日期
- 其他用来重建项目任意版本或分支的信息

**类型**

- 块（blob）：文件的每一个版本表示为一个块
- 目录树 （tree）：一个目录树对象代表一层目录信息
- 提交（commit）：一个提交（commit）对象保存版本库中每一次变化的元数据，包 括作者、提交者、提交日期和日志消息
- 标签（tag）:一个标签对象分配一个任意的且人类可读的名字给一个特定对 74 象，通常是一个提交对象

#### 2.1.3 索引

索引捕获项目在某个时刻的整体结构的一个版本。

例子：

你通过执行Git命令在索 引中暂存（stage）变更。变更通常是添加、删除或者编辑某个文件或 某些文件。索引会记录和保存那些变更，保障它们的安全直到你准备 好提交了。还可以删除或替换索引中的变更。

#### 2.1.4 可寻址内容名称

- 对象库中的每个对象都有一个唯一的名称，这个名称是向对象的内容应用SHA1得到的SHA1散列值。
- 全局唯一标识符：SHA散列计算的一个重要特性是不管内容在哪里， 它对同样的内容始终产生同样的ID

#### 2.1.5 git 追踪内容

1. Git的对象库基于其对象内容的散列计算的值，而不是基于用户原始文件布局的文件名或目录名设置。
2. 当文件从一个版本变到下一个版本的时候，Git的内部数据库有效地存储每个文件的每个版本，而不是它们的差异。

#### 2.1.6 打包文件

要创建一个打包文件，Git首先定位内容非常相似的全部文件，然后为它们之一存储整个内容。之后计算相似文件之间的差异并 且只存储差异。

### 2.2 工作时的概念

#### 2.2.1  对象、散列和blob

 Git只关心文件里面的内容：表示“hello world”的12个字节和换行符（跟之前创建的blob一样）。Git对这个blob执行一些操作，计算它的SHA1散列值，把散列值的十六进制表示作为文件名它放进对象库中。

#### 2.2.2 文件和树

- Git通过另一种叫做目录树（tree）的对象来跟踪文件的路径名
- **使用git add命令时，Git会给添加的每个文件的内容创建一个对象，但它并不会马上为树创建一个对象，而是更新索引**
- 每 次执行命令（比如，git add、git rm或者git mv）的时候，Git会用新的 路径名和blob信息来更新索引

```
git add .
git ls-files -s
// 100644 3b18e512dba79e4c8300dd08aeb37f8e728b8dad 0       hello.txt
```

#### 2.2.3 提交

- 标识关联文件的树对象的名称；
-  创作新版本的人（作者）的名字和创作的时间；
-  把新版本放到版本库的人（提交者）的名字和提交的时间；
-  对本次修订原因的说明（提交消息）

#### 2.2.4 标签

- 轻量级的 （lightweight）
  - 只是一个提交对象的引用，通常被版本库视为是私有的
  - 这些标签并不在版本库里创建永久对象
- 带附注的（annotated）

  - 带标注的标签则更加充 实，并且会创建一个对象
  - 它包含你提供的一条消息，并且可以根据 RFC 4880来使用GnuPG密钥进行数字签名


## 3. 文件管理和索引

- 可以在工作目录 里编辑，然后把修改提交给版本库来保管
- 在工作目录和版本库之间加设了一层索引（index），用 来暂存（stage）、收集或者修改
- 使用Git来管理代码时，你会在工作目录下编辑，在索引中积累修改
- 然后把索引中累积的修改作 为一次性的变更来进行提交

**步骤：**一次提交其实是个两步的过程

- 暂存变更
- 提交变更

```
git add hello.txt

// 把文件从暂存区移除 
git rm hello.txt --cached
// 把文件从暂存区移除并删除
git rm hello.txt -f
```

### 3.1 关于索引的一切

- Git的索引不包含任何文件内容，它仅仅追踪你想要提交的那些 内容
- 当执行git commit命令的时候，Git会通过检查索引而不是工作 目录来找到提交的内容

### 3.2 git 中的文件分类

- 已追踪的（Tracked）
  - 已经在版本库中的文件，或者是已暂存到索引中的文件
- 被忽略（Ignored）
  - 明确声明为不可见或被忽略
- 未追踪的（Untracked）

**查看**

```
git status
```

### 3.3 使用git add

- 将文件转化为已追踪的

- 作用于一个文件名，则递归暂存目录即子目录下的文件

  ```
  git add hello/abc/abc.txt
  
  git add hello
  ```

## 4. 提交

- 每一个Git提交都代表一个相对于之前的状态的单个原子变更集。
- 对于一个提交中所有做过的改动  ，无论多少目录、文件、 行、字节的改变，要么全部应用，要么全部拒绝。

### 4.1 提交历史记录

- git log id
  - 日志将从该提交开始回溯输出
- git log -n
  - 限制个数
- git log --oneline
  - 每个log一行输出
- git show HEAD~2
- gitk
  - 显示git提交图
- git log branchName
  - 显示某个分支的日志
- 

### 4.2 查找提交

- git blame 

  - 一个文件中的每一行最后是谁修改的和做了什么变更

  ```
  git blame -L 1, src/components/goods/goodsItem.vue
  ```


## 5. 分支

### 5.1 创建分支

- git branch branchName [starting-commit]

  - 如果没有指定的starting-commit ，就默认为当前分支上的最近提交

  ```
  git branch second 26ad3d1497ba11072a598797acb57468371a3d2f
  ```

### 5.2 查看/列出分支名

- git branch
- git branch -r: 显示远程追踪分支
- git branch -a: 显示所有分支
- git show-branch commitID

### 5.3 检出分支

- git checkout branchName
- git checkout -m branchName: 合并变更到不同分支
- git checkout -b branchName:  创建并检出新分支
- git branch -d branchName: 删除分支
- git merge branchName: 合并分支，把branchName合入本分支

## 6. diff

### 6.1 git diff命令的格式

**三个可供树或类树对象使用git diff命令的基本来源：**

- 整个提交图中的任意树对象；
- 工作目录； 
- 索引

**四种基本比较**

- git diff

  - 显示工作目录和索引之间的差异

  ![image-20211229221619961](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211229221619961.png)

- git diff commit

  - 显示工作目录和给定提交间的差异

  - 常见的一种用法是用HEAD或者一个特定的分支名作为commit

    ![image-20211229221826654](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211229221826654.png)

    - hello world 提交了一次
    - 跟上次提交进行diff

    ![image-20211229222036086](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211229222036086.png)

    - 跟 dev 分支进行diff

  - git diff commit1 commit2

## 7.  合并

- git merge 是区分上下文的
- 当前分支始终是目标分支
- 其他一个或多个分支始终合并到当前分支

### 7.1 有冲突的合并

```
// hello.txt(master提交)
hello world master

// hello.txt(dev提交)
hello world dev

... 
// git合并(在master合并dev)
git merge dev
// 使用git diff 查看冲突（索引与工作目录冲突）
git diff
git status
```

### 7.2 中止或重新启动合并

- git reset --hard HEAD 

  - 已经执行了git merge，但是合并后的文件还没有commit
- git reset --hard HEAD ORIG_HEAD

  - 在开始合并操作前，Git把原始分支的HEAD保存在 ORIG_HEAD
- 已经执行了git merge，合并的文件也commit了

## 8.  更改提交

### 8.1 使用 git reset

- git reset命令会把版本库和工作目录改变为已知状态
- git reset调整HEAD引用指向给定的提交
- 默认情况下还会更新索引以匹配该提交
- 令也可以修改工作目录以呈 现给定提交代表的项目修订版本

**重点：**

- HEAD
- 索引
- 工作目录建立
- 恢复已知状态

**三个主要选项：**

- --soft
- --mixed
- --hard

#### 8.1.1.1 git reset --soft

- --soft会将HEAD引用指向给定提交
- 索引和工作目录的内容保持不变
- 这个版本的命令有“最小”影响，只改变一个符号引用的状态使 其指向一个新提交

```
// 修改world.txt
git add world.txt
git status
git reset HEAD world.txt
```

- 最终结果-world.txt从暂存区撤回了工作区

#### 8.1.1.2 git reset --mixed

- --mixed会将HEAD指向给定提交
- 索引内容也跟着改变以符合给 定提交的树结构，但是工作目录中的内容保持不变
- 将索引变成你刚刚暂存该提交全部变化时的状态，它会显示工作目录 中还有什么修改
- --mixed是git reset的默认模式

```
// world.txt 第一次提交 -- 123456789git -m:第一次提交
// world.txt 第一次提交 -- 123456789git -m:第二次提交
git reset HEAD^
git log --oneline
e572364 (HEAD -> master) 第一次提交 //HEAD指向了上一次提交，索引变更了
```

![image-20211231004939656](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211231004939656.png)

如果不需要改变索引（因为一切都正确存储了），可以使用--soft参数

```
// world.txt 第一次提交 -- 123456789git -m:第一次提交
// world.txt 第一次提交 -- 123456789git -m:第二次提交
git reset HEAD^
git log --oneline
e572364 (HEAD -> master) 第一次提交 //HEAD指向了上一次提交，索引变更了
```

![image-20211231010243387](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211231010243387.png)

**通过图片即可对比--soft 与 --mixed**

- --soft:撤回到上次commit,而且把被撤掉的commit 内容加入到了暂存区(索引没变)
- --mixed:撤回到上次commit,没把commit内容加入暂存区(索引变化了)

#### 8.1.1.3 git reset--hard提交

- 将HEAD引用指向给定提交
- 索引的内容也跟着改变以 符合给定提交的树结构
- 工作目录的内容也随之改变以反映给 定提交表示的树的状态

```
// world.txt 第一次提交 -- 123456789git -m:第一次提交
// world.txt 第一次提交 -- 123456789git -m:第二次提交
git reset --hard HEAD^
git log --oneline
e572364 (HEAD -> master) 第一次提交 //HEAD指向了上一次提交，索引变更了
```

![image-20211231011235515](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211231011235515.png)

- 彻彻底底回到了第一次提交，就像没有发生过第二次提交一样

#### 8.1.1.4 三种模式总结

![image-20211230234340180](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211230234340180.png)

- 还把原始HEAD值存在ORIG_HEAD
- HEAD^ = HEAD ~1
- git reset commitId

### 8.2 使用git cherry-pick

```
// dev分支 -m feat:cherry-pick.txt
// cherry-pick.txt
123456789

// dev分支 -m feat: cherry-pick
//cherry-pick.txt
123456789为哦哦撒打发

// master 分支
git cherry-pick dev~1 // 挑选dev倒数第二个提交
// master 新增 cherry-pick.txt
//cherry-pick.txt 内容： 123456789
```

- git cherry-pick  --continue 继续挑选
- git cherry-pick  --abort 终止git cherry-pick

### 8.3 git revert

!['image-20220101104330400'](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220101104330400.png)

```
// 撤销提交消息为'第一次提交' 的commit
git revert master~2 #commit 去除第一次提交
```

![image-20220101104525865](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220101104525865.png)

- 解决冲突即可
- revert命令不修改版本库的现存历史记录
- 它往历史记录中添加新提交

### 8.4 修改最新提交

```
git commit --amend
```

- 作用：修改提交信息
- E：修改-进入vm命令编辑
- i: 插入
- esc ==> : ==> wq 写入保存退出

### 8.5 变基提交

- git rebase: 用来改变一串提交以什么为基础的
- 至少需要提交将迁往的分支名
- 默认情况：不在目标分支中的当前分支提交会变基

**常见用途：保持你正在开发的一系列提交相对于另一个分支是最新的**

![image-20220102122742919](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220102122742919.png)

- topic 分支从master分支的提交B处开始的
- 可以改写提交让他们基于提交E而不是提交B
- 这样提交就相对于master分支是最新的了

![image-20220102124656075](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220102124656075.png)

```
// hello.txt second 分支
hello world
测试git rebase(添加的内容在这行)
```

在commit后，使用命令

```
git rebase master
```

![image-20220102123952988](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220102123952988.png)

second的提交相对于master即是最新的了

```
git rebase --continue 继续变基
git rebase --abort 终止变基
```

## 9. 储藏和引用日志

```
// 存储
git stash save 'message'
// 存储列表
git stash list
//stash@{0}: On master: stash
//stash@{1}: On master: kaiku

// 查看某个存储
git stash show stash@{1}

// 弹出存储
git stash pop // 弹出且出栈
git stash apply // 弹出不出栈

// 弹出特定存储
git stash apply n
git stash pop stash@{1}
```

