# Christian Values Images

Put grid preview images in `/public/images/values/thumbs/`.

Put full modal images in `/public/images/values/full/`.

Recommended file naming:

```text
value-001.webp
value-002.webp
value-003.webp
```

The values data should reference public paths like:

```js
imageThumb: '/images/values/thumbs/value-001.webp',
imageFull: '/images/values/full/value-001.webp',
```

Use public image paths as strings. Do not import the full card image set into JavaScript.
