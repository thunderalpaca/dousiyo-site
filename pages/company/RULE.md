# company/RULE.md

ディレクトリ構造を以下のようにする。(調整中)

```
├── index.md
├── <会社名>
│   ├── index.md
│   ├── line
│   │   └── line1.md
│   └── car
│       └── 好きなディレクトリ構造
│           └── <型番>.md 
└── <グループ名>
    ├── index.md
    └── <会社名>
        └── ...
```

各ファイルのフォーマットを以下に示す。(調整中)  
ファイル名はローマ字とする。


<会社名>/index.md
```md
---
layout: doc
title: "放物"
description: "放物グループは、鉄道事業を中心に不動産開発、AI活用等の事業を展開しています。"
---

# {{ $frontmatter.title }}
<img src="/img/company/houbutu.webp" alt="放物のロゴ" width="100px">

## 概要
{{ $frontmatter.description }}

## 所持路線
- [<span style="color: #D7817E">理事冠状線 (B)</span>](/company/houbutu/line/rizikanzyousen.md)
- [<span style="color: #456E2C">書見勧誘線 (C)</span>](/company/houbutu/line/syokenkanyusen.md)
- [<span style="color: #9577A3">放物連絡線 (E)</span>](/company/houbutu/line/houbuturenrakusen.md)
- [<span style="color: #0281C4">ゆれつばめ (G)</span>](/company/houbutu/line/yuretubame.md)
- [<span style="color: #7B2CBF">空港誘導線 (H)</span>](/company/houbutu/line/kukoyudosen.md)
- [<span style="color: #D74B7E">丈北送信線 (I)</span>](/company/houbutu/line/zyouhokusousinsen.md)

```

<グループ名>/index.md
```md
---
layout: home

hero:
  name: "<グループ名>"
  tagline: の概要
---

# グループ会社一覧
- [会社1](/company/group1/company1)
- [会社2](/company/group1/company2)
```

car//kataban.md
```md
---
layout: doc
title: "P1000型"
description: "P1000型はバリン鯖S1で使用したものに現代化改造をほどこしました。"
---

# {{ $frontmatter.title }}
<!-- ![車両の写真]() -->

## 概要
{{ $frontmatter.description }}  
車両長: 16ブロック

## 特徴
### おおきな窓
上へと伸びるおおきな窓は外の景色を遮ることなく車内へ伝えます。
<!-- ![窓の写真]() -->
<!-- 車両の特徴についてタイトルを###で -->
```
