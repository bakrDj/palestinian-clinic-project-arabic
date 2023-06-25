import { matchSorter } from "match-sorter";

let fuzzySearchMultipleWords = (
  rows: any, // array of data [{a: "a", b: "b"}, {a: "c", b: "d"}]
  filterValue: string, // potentially multi-word search string "two words"
  keys: any // keys to search ["a", "b"]
) => {
  if (!filterValue || !filterValue.length) {
    return rows;
  }

  const terms = filterValue.split(" ");
  if (!terms) {
    return rows;
  }

  // reduceRight will mean sorting is done by score for the _first_ entered word.
  return terms.reduceRight((results, term) => matchSorter(results, term, { keys }), rows);
};

export default fuzzySearchMultipleWords;
