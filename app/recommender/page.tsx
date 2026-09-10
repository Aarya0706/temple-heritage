import { redirect } from "next/navigation";

// /recommender moved to /discover as a top-level nav tab. Keeping this
// redirect so any existing links/bookmarks to the old URL still work.
export default function RecommenderRedirect() {
  redirect("/discover");
}
