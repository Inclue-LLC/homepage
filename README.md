# 合同会社インクルー 会社ホームページ

会社紹介資料（COMPANY PROFILE）の内容をもとにした静的なコーポレートサイトです。ビルドは不要です。

## 構成

```
index.html            1ページ構成のトップページ
assets/css/style.css  スタイル（配色・フォントは会社紹介資料に準拠）
assets/js/main.js     スマホメニュー・スクロール演出
assets/img/           会社紹介資料から書き出した画像（WebP）、OGP画像、ファビコン
```

## セクション

ヒーロー / 事業内容 / キャラクターリスト / スタジオハヌル / Lovely MongMong / ふにゅ / 中国展開 / Gachafy と POP BASE / 会社概要 / お問い合わせ

## 確認方法

`index.html` をブラウザで開くか、ローカルサーバーを起動します。

```bash
python3 -m http.server 8000
```

GitHub Pages などの静的ホスティングにそのまま公開できます。公開時は `og:image` を絶対URLに変更してください。
