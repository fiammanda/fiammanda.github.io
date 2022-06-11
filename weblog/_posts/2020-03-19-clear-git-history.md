---
title: 暴力清理 Git 历史
permalink: /weblog/clear-git-history
---

``` bash
git checkout --orphan new
git add -A
git commit -am "commited"
git branch -D main
git branch -m main
git push -f origin main
```

Gridea 通过程序推送，不用最后一行。