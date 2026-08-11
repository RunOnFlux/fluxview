import { useEffect } from "react";

const SITE = "Flux View";

// every route used to render the same "Flux View" title, which left tabs,
// history entries and bookmarks indistinguishable from each other
const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : SITE;
  }, [title]);
};

export default usePageTitle;
