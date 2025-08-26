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
line:
  houB:
    prev: null
    next: "satutaba"
    number: "01"
  houC:
    prev: null
    next: "sanyo"
    number: "01"
  houE:
    prev: null
    next: "syotu"
    number: "01"
x: 0
y: 0
description: "高賀駅は、3路線が乗り入れる6面10線の大規模な放物の駅です。"
---

# {{ $frontmatter.title }}
![高賀駅を正面から見ている](/img/tour/koka.png)

## 他にも{{ $frontmatter.title }}駅があります
- [東高賀](/station/stations/higashikoka.md)
- [高賀南](/station/stations/kokaminami.md)
- [新高賀](/station/stations/sinkoka.md)

## 概要
{{ $frontmatter.description }}  
管理: [放物](/company/houbutu/index.md)  
ひらがな: こうか  
ローマ字: Koka  
ナンバリング: <Numberling />

## 乗り入れ路線
<LineInfo />

## 名所案内
- VOID
![VOID](/img/tour/void.png)
```

lineのかきかた
```
line:
  houB:
    prev: null
    next: "satutaba"
    number: "01"
```
`houB`というのは路線のIDです。このIDは会社の先頭3文字と路線のナンバリング文字を組み合わせたものです。  
豊急本線の場合`toyT`になります。
`prev`はその路線の前の駅のファイル名から拡張子を取り除いたもの、`next`も同様です。`number`はその路線でのナンバリングの数字です。
データが正しく追加されているかは http://127.0.0.1:5173/data で確認できます。