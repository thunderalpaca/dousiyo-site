# station/RULE.md

ディレクトリ構造を以下のようにする。(調整中)

```
├── index.md
├── <駅名1>.md
└── <駅名2>.md
```

各ファイルのフォーマットを以下に示す。(調整中)
ファイル名はローマ字とする。

<駅名1>.md
```md
---
layout: doc
title: "高賀"
description: "高賀駅は、3路線が乗り入れる6面10線の大規模な放物の駅です。"
---

# {{ $frontmatter.title }}
<!-- ![高賀駅を正面から見ている]() -->

## 他にも{{ $frontmatter.title }}駅があります
<!-- この情報は代表駅にのみ追加してください -->
- [東高賀](/station/stations/higashikoka.md)
- [高賀南](/station/stations/kokaminami.md)
- [新高賀](/station/stations/sinkoka.md)

## 概要
{{ $frontmatter.description }}  
管理: [放物](/company/houbutu/index.md)  
ひらがな: こうか  
ローマ字: Koka  
ナンバリング: `B01`, `C01`, `E01`

## 乗り入れ路線
- [<span style="color: #D7817E">理事冠状線 (B)</span>](/company/houbutu/line/rizikanzyousen.md)
- [<span style="color: #456E2C">書見勧誘線 (C)</span>](/company/houbutu/line/syokenkanyusen.md)
- [<span style="color: #9577A3">放物連絡線 (E)</span>](/company/houbutu/line/houbuturenrakusen.md)

## 名所案内
<!-- 名所がある場合のみ追加してください -->
- VOID
![VOID](/img/tour/void.png)
```