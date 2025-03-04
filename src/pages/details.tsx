import { useParams } from "react-router-dom";
import { Book, MimeTypeEnum } from "../util/gutendex_api";
import { useQuery } from "@tanstack/react-query";
import { Favourite } from "../components/favourites";
import { retreiveData, storeData } from "../util/localstorage";

async function fetchBookDetails(id: string) {
  const res = await fetch(`https://gutendex.com/books/${id}`);
  if (!res.ok) {
    throw Error("failed to fetch book details");
  }
  const data = await res.json();
  return data as Book;
}

function handleFavouriteClick(favourite: Favourite) {
  const data = retreiveData<Favourite[]>("favourites") ?? [];
  if (data.find((val) => val.id === favourite.id)) {
    return;
  }
  data.push(favourite);
  console.log({
    timestamp: new Date(),
    data: data,
  });
  storeData("favourites", data);
}

function Details() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bookDetails", id],
    queryFn: () => fetchBookDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading book details...</div>;
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-black">{data?.title}</h1>
      {/* <p>{data?.summaries}</p> */}
      <div>
        <h2 className="text-2xl font-semibold mt-4 mb-4">Authors</h2>
        <ul>
          {data?.authors.map((author, index) => (
            <li
              key={index}
              className="nth-[3n]:bg-zinc-800 nth-[3n+1]:bg-zinc-900 nth-[3n+2]:bg-zinc-950 border-zinc-600 border-2"
            >
              {
                // TODO: take from the other author rendering function / extract into function
              }
              {author.name} ({author.birth_year} - {author.death_year})
            </li>
          ))}
        </ul>
        {data?.formats["image/jpeg"] ? (
          <img
            src={data.formats["image/jpeg"]}
            alt="book cover"
            className="mx-auto mt-4"
          ></img>
        ) : (
          <></>
        )}
        <h2 className="text-2xl font-semibold mt-4 mb-4">Languages</h2>
        <ul>
          {data?.languages.map((language, index) => {
            return (
              <li
                className="nth-[3n]:bg-zinc-800 nth-[3n+1]:bg-zinc-900 nth-[3n+2]:bg-zinc-950 border-zinc-600 border-2"
                key={index}
              >
                {language.trim()}
              </li>
            );
          })}
        </ul>
        <h2 className="text-2xl font-semibold mt-4 mb-4">Topics</h2>
        <ul className="grid grid-cols-2">
          {data?.subjects.map((subject, index) => {
            return (
              <li
                className="nth-[3n]:bg-zinc-800 nth-[3n+1]:bg-zinc-900 nth-[3n+2]:bg-zinc-950 border-zinc-600 border-2"
                key={index}
              >
                {subject.trim().split("--")[0].trimEnd()}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 mb-2">Downloads: {data?.download_count}</p>
        <h2 className="text-2xl font-semibold mt-4">Formats</h2>
        <ul className="xl:grid xl:grid-cols-3 mb-2 mt-2">
          {Object.entries(MimeTypeEnum)
            .filter((nval) => {
              return (
                nval[1] !== MimeTypeEnum.jpeg &&
                (data?.formats[nval[1]] ?? false)
              );
            })
            .map((nval) => {
              // yes they're the values of the enum, but the keys of the formats object
              const [name, value] = nval;
              return (
                <li key={name}>
                  <a
                    className="text-sky-600 visited:text-purple-600 hover:text-sky-900 hover:underline hover:cursor-pointer"
                    href={data?.formats[value]}
                  >
                    {name}
                  </a>
                </li>
              );
            })}
        </ul>
        <button
          type="button"
          className="bg-slate-800 px-4 pb-1 pt-1 rounded-3xl border-2 border-slate-700 hover:cursor-pointer"
          onClick={() => {
            if (id) {
              handleFavouriteClick({
                id: id!,
                authors: data!.authors!,
                title: data!.title!,
              });
            }
          }}
        >
          ⭐ Add to favourites
        </button>
      </div>
    </div>
  );
}

export default Details;
