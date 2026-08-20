// Base64-encoded app logo, embedded into the itinerary PDF header.
//
// Fill LOGO_BASE64 in with your actual logo. To generate it from a file
// already in your repo (e.g. public/logo.png):
//
//   node -e "console.log(require('fs').readFileSync('public/logo.png').toString('base64'))" > logo.b64.txt
//
// then paste the contents of logo.b64.txt as the string below. Keep
// LOGO_FORMAT in sync with the file type ("PNG" or "JPEG").
//
// Until this is filled in, DownloadItineraryButton skips drawing the logo
// and falls back to text-only header (no crash, no broken image).

export const LOGO_BASE64 = ""; // <-- paste base64 string here

export const LOGO_FORMAT: "PNG" | "JPEG" = "PNG";

// Natural pixel dimensions of the logo file above (used to keep aspect
// ratio correct when it's scaled down to fit the PDF header). Update these
// to match the actual logo you paste in.
export const LOGO_WIDTH_PX = 512;
export const LOGO_HEIGHT_PX = 512;