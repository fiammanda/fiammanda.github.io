---
title: 暴力清理 Git 历史
permalink: /weblog/clear-git-history
---

```
git checkout --orphan new
git add -A
git commit -am "Fresh commit"
git branch -D master
git branch -m master
git push -f origin master
```

Gridea 通过程序推送，不用最后一行。