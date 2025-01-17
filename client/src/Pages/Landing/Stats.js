import React from "react";
import bb from "../../assets/bb.png";
import bb2 from "../../assets/bb2.png";

function Stats() {
  return (
    <div className="bg-rose-200 px-4 md:px-24 py-8">
      <h2 className="md:text-4xl text-3xl font-light text-rose-950 text-center md:text-start capitalize">
        Undefeted Number of{" "}
        <span className="font-bold italicFont"> marriage experts</span>
      </h2>
      <h2 className="text-md max-w-2xl mt-2 font-light text-rose-950 text-justify md:text-start capitalize">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
        asperiores similique, voluptates debitis, id autem nostrum doloremque
        accusantium sed expedita
      </h2>

      {/* Desktop Layout - Completely Unchanged */}
      <div className="hidden md:flex items-center justify-between w-full mt-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-3 items-center justify-center">
            <img src={bb} alt="err" className="rounded-full" />
            <img src={bb2} alt="err" className="rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-rose-950 text-start capitalize mt-2">
            11,204
          </h2>
          <h2 className="text-md max-w-2xl font-light text-rose-950 text-center lg:text-start capitalize">
            Total Grooms & Brides
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center">
          <img src={bb2} alt="err" className="rounded-full" />
          <h2 className="text-2xl font-bold text-rose-950 text-center lg:text-start capitalize mt-2">
            11,204
          </h2>
          <h2 className="text-md max-w-2xl font-light text-rose-950 text-center lg:text-startcapitalize">
            Total Groom's Proposals
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center">
          <img src={bb} alt="err" className="rounded-full" />
          <h2 className="text-2xl font-bold text-rose-950 text-center lg:text-start capitalize mt-2">
            11,204
          </h2>
          <h2 className="text-md max-w-2xl font-light text-rose-950 text-center lg:text-start capitalize">
            total bride's proposal
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-3 items-center justify-center">
            <img src={bb} alt="err" className="rounded-full" />
            <img src={bb2} alt="err" className="rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-rose-950 text-center lg:text-start capitalize mt-2">
            11,204
          </h2>
          <h2 className="text-md max-w-2xl font-light text-rose-950 text-center lg:text-start capitalize">
            Total Successfull Proposals
          </h2>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden grid grid-cols-2 gap-4 mt-6 px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={bb2}
            alt="err"
            className="rounded-full w-12 h-12 object-cover mb-2"
          />
          <h2 className="text-xl font-bold text-rose-950 capitalize">11,204</h2>
          <h2 className="text-sm font-light text-rose-950 capitalize">
            Total Groom's Proposals
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={bb}
            alt="err"
            className="rounded-full w-12 h-12 object-cover mb-2"
          />
          <h2 className="text-xl font-bold text-rose-950 capitalize">11,204</h2>
          <h2 className="text-sm font-light text-rose-950 capitalize">
            total bride's proposal
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex space-x-2 items-center justify-center mb-2">
            <img
              src={bb}
              alt="err"
              className="rounded-full w-12 h-12 object-cover"
            />
            <img
              src={bb2}
              alt="err"
              className="rounded-full w-12 h-12 object-cover"
            />
          </div>
          <h2 className="text-xl font-bold text-rose-950 capitalize">11,204</h2>
          <h2 className="text-sm font-light text-rose-950 capitalize">
            Total Grooms & Brides
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex space-x-2 items-center justify-center mb-2">
            <img
              src={bb}
              alt="err"
              className="rounded-full w-12 h-12 object-cover"
            />
            <img
              src={bb2}
              alt="err"
              className="rounded-full w-12 h-12 object-cover"
            />
          </div>
          <h2 className="text-xl font-bold text-rose-950 capitalize">11,204</h2>
          <h2 className="text-sm font-light text-rose-950 capitalize">
            Total Successfull Proposals
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Stats;
