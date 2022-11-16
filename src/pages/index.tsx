import Head from "next/head";
import React from "react";
import Image from "next/image";
import githubLogo from "../public/assets/github.png";

export default function Home() {
  const [apiResponse, setApiResponse] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);

    fetch("/api/upsert-url", {
      method: "POST",
      body: JSON.stringify({
        url: event.target.url.value,
      }),
    })
      .then((res) => {
        if (res?.ok) {
          res.json().then((data) => setApiResponse(data));
          return;
        }
        res.json().then((data) => setErrorMessage(data.message));
      })
      .catch((error) => setErrorMessage(error));

    setLoading(false);
  };

  const storeIntoClipboard = () => {
    if (!apiResponse) return;

    const fullShrtLink = window.location.href + apiResponse.data.slug;
    navigator.clipboard.writeText(fullShrtLink);
  };

  return (
    <div className="m-[1rem] text-center">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex mx-auto my-[1rem] h-[3rem] max-w-[800px] ">
        <div className="my-auto mx-0">lwTshort</div>

        <div className="my-auto mr-0 ml-auto">
          <a
            className="m-auto"
            href="https://github.com/LeoWie93"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className="m-auto h-8 w-[100%] "
              src={githubLogo}
              alt="my github"
              width={100}
              height={100}
            />
          </a>
        </div>
      </header>

      <main className="flex flex-col mx-auto mt-40 mb-auto max-w-[800px] w-[100%]">
        <h1 className="text-6xl">lwTshort</h1>
        <h2>
          by{" "}
          <a
            href="https://github.com/LeoWie93/lwtshort"
            className="text-violet-500"
          >
            Leonardo Wiedemeier
          </a>
        </h2>

        <div className="max-w-lg m-auto mt-6 w-[100%]">
          {!apiResponse && (
            <form
              onSubmit={handleSubmit}
              method="POST"
              className="grid grid-rows-2 gap-4"
            >
              <input
                type="text"
                name="url"
                required
                placeholder="Enter your unbearingly long url"
                className="text-black text-center rounded-md"
              ></input>
              <button
                type="submit"
                className={
                  loading
                    ? "cursor-default"
                    : "cursor-pointer" &&
                      "w-40 m-auto  bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded cursor-pointer"
                }
              >
                {!loading && "Submit"}
                {loading && (
                  <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>
                )}
              </button>
              {errorMessage && (
                <p className="text-red-500 text-s font-bold">{errorMessage}</p>
              )}
            </form>
          )}

          {apiResponse && (
            <div className="bg-violet-50 rounded-md h-20 w-80 text-center m-auto mt-5 text-black">
              {apiResponse.message}{" "}
              <div
                className="text-purple-600 text-bold cursor-pointer"
                onClick={storeIntoClipboard}
              >
                {window.location.href + apiResponse.data.slug}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
