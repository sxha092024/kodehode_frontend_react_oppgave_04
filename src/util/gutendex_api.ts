/* A thin API wrapper that provides some *minor* quality of life (read: type-hinting and autocompletion)
 *
 * Goals: Wrap what I use, need, or want auto-completion for.
 *
 * Non-goals: full API client for gutendex.
 */

// there is only one route, /books
const BASE_URL = "https://gutendex.com/books";

interface Param {
  /**
   * returns a stringified query parameter, in the following format`param=value` or `param1=value1&param2=value2`
   */
  toQueryParam(): string;
}

export class AuthorYear implements Param {
  start: Number | null = null;
  end: Number | null = null;
  toQueryParam(): string {
    // we could probably flip this to start === null || end === null as that is probably more common
    if (this.start !== null && this.end !== null) {
      return `author_year_start=${this.start}&author_year_end=${this.end}`;
    } else {
      let queryParam = "";
      this.start !== null
        ? (queryParam += `author_year_start=${this.start}`)
        : undefined;
      this.end !== null
        ? (queryParam += `author_year_end=${this.end}`)
        : undefined;
      return queryParam;
    }
  }
}

export class Langauge implements Param {
  codes: Set<String>; // incurs some runtime cost, it may be better to de-dup by hand
  toQueryParam(): string {
    const queryParam = "languages=";
    const langs = Array.prototype.concat(this.codes).join(",");
    return queryParam + langs;
  }

  constructor(langauges: String) {
    // gyu, Globaly, stickY, Unicode
    const matches = langauges.matchAll(new RegExp(",{0,1}([A-z]{2}?)", "gyu"));
    const found: String[] = [];
    for (const match of matches) {
      found.push(match[0]);
    }
    if (found.join(",").length === langauges.length) {
      this.codes = new Set(found);
    } else {
      // TODO: faulty input provided, find where and throw
      throw new Error("");
    }
  }
}

export class Copyright implements Param {
  copyright: boolean | null;

  constructor(copyright?: boolean | null) {
    this.copyright = copyright ?? null; // the only state we *don't* want is undefined
  }
  toQueryParam(): string {
    return `copyright?${this.copyright}`;
  }
}

export class Id implements Param {
  ids: number[];

  constructor(ids: number[] = []) {
    this.ids = ids; // ideally, deny floats
  }

  toQueryParam(): string {
    const queryParam = "ids=";
    const ids = this.ids.join(",");
    return queryParam + ids;
  }
}

export enum MimeTypeEnum {
  html = "text/html",
  epub = "application/epub+zip",
  ebook = "application/x-mobipocket-ebook",
  xml = "application/rdf+xml",
  jpeg = "image/jpeg",
  text_ascii = "text/plain; charset=us-ascii",
  appication_octet = "application/octet-stream",
  html_iso8859 = "text/html; charset=iso-8859-1",
  text_iso8859 = "text/plain; charset=iso-8859-1",
  text_utf8 = "text/html; charset=utf-8",
  text_utf = "text/plain; charset=utf-8",
  html_ascii = "text/html; charset=us-ascii",
  text = "text/plain",
}

export class MimeType implements Param {
  mimeType: MimeTypeEnum;

  constructor(mimeType: MimeTypeEnum) {
    this.mimeType = mimeType;
  }

  toQueryParam(): string {
    return `mime_type=${this.mimeType}`;
  }
}

export interface Pagination {
  count: number;
  next?: string;
  previous?: string;
  results: Book[];
}

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  summaries: string[];
  translators: Translator[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: Formats;
  download_count: number;
}

export interface Author {
  name: string;
  birth_year?: number; // yes, really
  death_year?: number; // yes, really
}

export interface Translator {
  name: string;
  birth_year: number;
  death_year: number;
}

// yes really, mark every format as nullable.
export interface Formats {
  "text/html"?: string;
  "application/epub+zip"?: string;
  "application/x-mobipocket-ebook"?: string;
  "application/rdf+xml"?: string;
  "image/jpeg"?: string;
  "text/plain; charset=us-ascii"?: string;
  "application/octet-stream"?: string;
  "text/html; charset=iso-8859-1"?: string;
  "text/plain; charset=iso-8859-1"?: string;
  "text/html; charset=utf-8"?: string;
  "text/plain; charset=utf-8"?: string;
  "text/html; charset=us-ascii"?: string;
  "text/plain"?: string;
}

export async function fetchQuery(
  params: Param[] = [],
): Promise<Pagination | Book> {
  const qParams = params.reduce((prev, param, idx) => {
    if (idx === 0) {
      return param.toQueryParam();
    } else {
      return `${prev}&${param.toQueryParam()}`;
    }
  }, "");
  const queryString = params.length > 0 ? `?${qParams}` : "";
  const url = `${BASE_URL}${queryString}`;
  console.log({
    timestamp: new Date(),
    callsite: `/util/gutendex_api.ts::${fetchQuery.name}`,
    target: url,
  });
  const resp = await fetch(url);
  const json: Pagination | Book = await resp.json();
  return json;
}

export default { fetchQuery, MimeTypeEnum };
