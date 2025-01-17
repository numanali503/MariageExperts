import React from "react";

function FilterProposals() {
  return (
    <div className="lg:px-24 px-4 py-8">
      <h2 className="md:text-4xl text-3xl font-light text-rose-950 text-center capitalize">
        Find Popular<span className="font-bold italicFont"> Matrimony </span>{" "}
        Profiles by
      </h2>
      <h2 className="text-md max-w-2xl mx-auto mt-2 font-light text-rose-950 md:text-center text-justify capitalize">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
        asperiores similique, voluptates debitis, id autem nostrum doloremque
        accusantium sed expedita
      </h2>

      <div className="flex items-center flex-wrap lg:flex-nowrap justify-center w-full my-8 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="h-64 bg-rose-200 rounded w-full flex items-center justify-center flex-col">
          <i className="fa-duotone fa-thin fa-language text-[80px] text-rose-950"></i>
          <h1 className="text-xl font-bold text-rose-950 tracking-wide">
            Mother Tongue
          </h1>
          <h1 className="text-sm text-rose-950 tracking-wide">
            English | Urdu | Punjabi | Saraki | Pashto
          </h1>

        </div>

        <div className="h-64 bg-rose-200 rounded w-full flex items-center justify-center flex-col">
          <i className="fa-duotone fa-thin fa-star-and-crescent text-[78px] text-rose-950"></i>
          <h1 className="text-xl font-bold text-rose-950 mt-1 tracking-wide">
            Religion & Sect
          </h1>
          <h1 className="text-sm text-rose-950 tracking-wide text-center">
            Muslim | Christian | Shia | Deoband <br />| Ahl e Hadith
          </h1>

        </div>

        <div className="h-64 bg-rose-200 rounded w-full flex items-center justify-center flex-col">
          <i className="fa-duotone fa-thin fa-user-tie text-[80px] text-rose-950"></i>
          <h1 className="text-xl font-bold text-rose-950 mt-1 tracking-wide">
            Profession
          </h1>
          <h1 className="text-sm text-rose-950 tracking-wide">
            Engineer | Doctor | Business Person
          </h1>

        </div>

        <div className="h-64 bg-rose-200 rounded w-full flex items-center justify-center flex-col">
          <i className="fa-duotone fa-thin fa-people text-[80px] text-rose-950"></i>
          <h1 className="text-xl font-bold text-rose-950 tracking-wide">
            Community
          </h1>
          <h1 className="text-sm text-rose-950 tracking-wide">
            Elite Class | High Class | Middle Class
          </h1>

        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <button className="mt-4 text-white bg-rose-950 rounded-full px-8 py-2">
          View All <i class="fa-duotone fa-light fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default FilterProposals;
