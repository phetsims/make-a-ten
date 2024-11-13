/* eslint-disable */
/* @formatter:off */

import MipmapElement from '../../phet-core/js/MipmapElement.js';

// The levels in the mipmap. Specify explicit types rather than inferring to assist the type checker, for this boilerplate case.
const mipmaps = [
  new MipmapElement( 160, 312, 'data:image/png;base64,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' ),
  new MipmapElement( 80, 156, 'data:image/png;base64,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' ),
  new MipmapElement( 40, 78, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABOCAYAAABSU1QqAAAAAklEQVR4AewaftIAAATtSURBVM3Bf4zWdR0A8NfzeY474ThPIAhC4ExZ/BjchM3Nzg0dw2w2TdfcYtPQYvhH0ZZjy7LpVubyj0q3bItcJaVTZ4htsGTWmFu4KCyKcnGTIT/PHAK35DwZ9mzPbXdf3t/n7rkfz1der5KJsxjrsQLz0I7pKKk6hWN4Ed9Wp5LxW4HvYhVa1ecl3KoOZeNzP55AJ5rV71PoxLNGUDZ2T+LraDM2i9CO3xtG2di8gLUoG7sSOtGN/WpIRm8rbjcxpmCTYZSNzhbcIV8/XsM+lDFdfdrxBxyRo6x+j2IDSqIe3Iev4Rk8jqOYidkoq60ZHdgiR1l91uMhTBIdxN14QdZePIm9mIzJaEVZ1IESdrlA2ciuxs9xmeg4vohdajuAZ/EYTqALk2WVsBRPo9cQZSN7HktEp3AvXla/vejFajTJasV0bDNEMryHcZ3oHB7Fb43eT7FZvs+4QFLbImyQbxseMXYbsUc0B/cZIqntB5ghOoC7jd+DeE/0OUMk+VZjjagf30Ov8duB34k6MdmAJN9GTBa9jKdMnAdwRtY0fNmAJLoKN4jexSYTqxv7RKsNSKL70SbahjdMvD2iJQYk0fWik3hAY2wVLcAsFUnWXfik6BUc1Riv4h1ZLbhLRZJ1i+gDbNZY/xWtVJFkdYr+jZ0a67joChXJoGXoEO3WeIdFc1Ukg9aiSdYH2KzxekSzMSMZdLXoTfxV4/1T1IRbk0ELRfsUY698S5Oqj+Ny0SuKsR/vixYkVXeiWdZpPKU4p0XTk6qVooM4qzh9ohlJ1ULRG4p1XtSeVM0V7VGsM6JJCUswW1Y/fqNYfaLWhJtEx9CjWP2iSxLmid5ycWhJWCA66OLwYcKlom4Xh96EqaKXXBx6E6bJOoV9ijdFdCahRdZpH4120fGEJlk9PhotomMJLbLOKF4TPiY6kdAs65TiXYNLRCcS2mS9rXjXy/fnhJKss4o3U74DSXRe8TpE/TiRRJMU7zJRn4okale8OWpIossVr13UpyKJ2hRrAWaJ+lUknJE1R7FuRxK9pyKhT9YMxVoh3zEVCX2ypuKzirNcvm4VCSdFaxRjDRbJt1NFwkHRIsVYj2bR23hORcJrog6N14RV8v3dgISn0S9rPto01ibMkm+7AQlHcFRWK9ZprNvkO44fG5BUHRJ1aZwuLJfvVUMkVf8SLdM496JF1I8nDJFU7RNdhSUaY5V8e7HLEEnV83hfVjO+YuJtxDz5fu0CSdVJHBKtMvG+IN8B/MQFkkH/EC1Fl4nTiZXyvShHMmibqAXfMHG+iSmiE3hQjmTQFvxHdBPuMH5zcaN8O3BWjiRru2gKfoQu4/MwpotO4TtqSLK+hSOiT2ALuozNCnxevp04qoayrHNoww2iabgZ7+J1o/MrLBH9D+vQo4ayaBfWYL5oKm7EcuxGr5F9H3eiJNqBxwyjLN/ruAVtoiYsxZewHD04LFqMzViHJlEvNuCIYZTUtg6Po83wzuEw3kK/qplYiFa1/QL3GEFZbX9DP67DJLUlTEMHrsSVmI1mtR3EzThnBGXD240+fBotJkYfNuEv6lA2st14E9fiUuPzIX6GR9SprD77sR3L0GHsnsM9RqGsfu/gl2jCYrSq33k8g7VGqWz0/oitmI8FmGR4J/FDfNUYlIzPtdiIazAfTarO4xD+hIfQbYz+D6Tn+WIwld2HAAAAAElFTkSuQmCC' ),
  new MipmapElement( 20, 39, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAnCAYAAAAPZ2gOAAAAAklEQVR4AewaftIAAAJlSURBVKXBTWiWBRwA8N/7f1ysj23VErXltj5o4SFiSXXyIlZ0EwYdhplWFB2k8GSHCKpDER6ChIIOIZTE7CDCAiEqoSgpiYg+JO0yRx8oM3T2Nrde+A+ezb1z7/v0+9WsbCcex524ER04hyMYcZmaK9uPR9GhuYMYsUBheYcxgsLyhnAeX5pXaO4Atkp1HMQn6EIvalKgF++YV1jqVTyNGup4Gbswjn2YQA23ocA6XIsjGgqLPYg30Ik5vIUXLHYcH2AAw6hhEHs1hMVeQrf0GZ6zvCfxndSH3RpC6QncJ53Bbit7HTPSQxpCaQcK6QC+tbL3cVLaoCGkYdwr/Y49WndCWodNIW1Dp/Q5zmndKSnwcEgbpVl8qD0/K90V0u3SaYxpz1dKfYFNWCP9qH3HcFG6KfAIQjqumn+knsAGaRaHVTMtXR24WfoLR1UzI3UGbpAm/X+zgeukCdWF9HegUzqtumukM4EOaVI1/eiWzgY6pUnVbEZIU4GadEk1dyhdCKW1qulXqgdmpFtUs17pQmBa6lfNoNKvgbPSgPZtx3qpjo8CJ6U+XKU9owjpF3wf+Enqwg6tG8D9Sp9qCHyhtFnrnke3NIW9GgJjOC8Na90WpaM4pSEwjRPSrdhuZaMYkurYZ15I41JgDwZc2TMopK8xbl5IL+I3aQiHsFFzT+EB6RLetkAhzeJfbEGBNdiKQfyAKekxvIIe6Rh2WaBmsTfxLAqlafyBVViLQrqIbRizQGGxcfTiHqySOnA9uhHSHN7Day5TWOpj/Im70WOpORzCqCYKzX2D/ViN1eiSJvAudlrGf06nfLQZ5A2dAAAAAElFTkSuQmCC' ),
  new MipmapElement( 10, 20, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAAAklEQVR4AewaftIAAAEHSURBVHXBOyuFYQAA4Oe8XySXlFyKTHIYhAirwWpyKZlkNSiL5BeYTC6FAVlMlPIDKIPF5L4YnDqREInEqU/p1PmeJyXfKOaRRoRDDMqJ/BvDMsrwiCqk8YmjSKwZ2/jBGKaRRS86sBiJraIbs9gVO0XAEF4C6jGAY6zIt4AM+gMmUYkthWXQFNCDLDYU9oDagCbcSvaKioAa3Ej2ieKAclxJVoS3gGJcS1aN54AI35JV4yPgC62S1eE94AltCptCDS4C7tCqsBF8YyfgCi3okq8T3TjDXsAmUlhCg39zKMW2nJTYOiZwjxOUYACX6JATie2jEX1oRxovmMG5nJR8wxgXW8OBP784yTdXWjIKFgAAAABJRU5ErkJggg==' )
];

export default mipmaps;