# Industry card artwork

Drop the nine card images for the home-page deck in this folder, named exactly
as below. The name is what `src/config/copy.ts` points at, so getting the
filename right is all that is needed — no code change per image.

| # | Industry | Filename |
|---|----------------------|-------------------------------|
| 01 | Luxury | `luxury.jpg` |
| 02 | Fashion | `fashion.jpg` |
| 03 | Hospitality | `hospitality.jpg` |
| 04 | Food & Beverage | `food-and-beverage.jpg` |
| 05 | Lifestyle | `lifestyle.jpg` |
| 06 | Real Estate | `real-estate.jpg` |
| 07 | Healthcare | `healthcare.jpg` |
| 08 | Professional Services | `professional-services.jpg` |
| 09 | Startups | `startups.jpg` |

`.webp` works too — if you use it, say so and the paths get updated to match.

## What the artwork needs to be

**Portrait, 3:4.** The card is 3:4 and the image is cropped to fill it, so
anything squarer gets its sides cut and anything taller (a 9:16 story frame)
loses its foot.

**At least 560 x 746 px**, which is 2x the largest the card is ever drawn
(278 x 370). Bigger is fine; much bigger is wasted bytes, since all nine load
up front on the opening screen — keep each under ~150 KB.

**Put the subject in the top two-thirds.** The crop is anchored to the top of
the image, so if the frame does have to cut, it cuts from the bottom.

**No text near the edges.** A rounded corner and a hairline border sit over the
artwork, and the card carries its own index numeral in the top-right.
