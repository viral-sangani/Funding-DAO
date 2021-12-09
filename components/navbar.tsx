import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useData } from "../contexts/dataContext";

function Navbar() {
  const router = useRouter();
  const { account, connect, isMember, isStakeholder } = useData();

  return (
    <>
      <nav className="w-full h-16 mt-auto max-w-5xl">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="">
            <Link href="/" passHref>
              <span className="font-semibold text-xl cursor-pointer">
                FundingDAO
              </span>
            </Link>
            <span className="text-xs bg-blue-500 text-white rounded-lg py-1 px-1 font-bold ml-2">
              {!isMember && !isStakeholder
                ? "Not a Member"
                : isStakeholder
                ? "Stakeholder"
                : "Member"}
            </span>
          </div>

          {account ? (
            <div className="bg-green-500 px-6 py-2 rounded-md cursor-pointer">
              <span className="text-lg text-white">
                {account.substr(0, 10)}...
              </span>
            </div>
          ) : (
            <div
              className="bg-green-500 px-6 py-2 rounded-md cursor-pointer"
              onClick={() => {
                connect();
              }}
            >
              <span className="text-lg text-white">Connect</span>
            </div>
          )}
        </div>
      </nav>
      <nav className="w-full h-16 m-auto max-w-5xl flex justify-center">
        <div className="flex flex-row justify-between items-center h-full">
          {account && (
            <div className="flex flex-row items-center justify-center h-full">
              <TabButton
                title="Home"
                isActive={router.asPath === "/"}
                url={"/"}
              />
              {isMember && (
                <TabButton
                  title="Create Proposal"
                  isActive={router.asPath === "/create-proposal"}
                  url={"/create-proposal"}
                />
              )}
              {isMember && (
                <TabButton
                  title="Stakeholder Lounge"
                  isActive={router.asPath === "/stakeholder-lounge"}
                  url={"/stakeholder-lounge "}
                />
              )}
              {isStakeholder && (
                <TabButton
                  title="Investments"
                  isActive={router.asPath === "/investments"}
                  url={"/investments"}
                />
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

const TabButton = ({
  title,
  isActive,
  url,
}: {
  title: string;
  isActive: boolean;
  url: string;
}) => {
  return (
    <Link href={url} passHref>
      <div
        className={`h-full px-3 flex items-center border-b-2 font-semibold hover:border-blue-700 hover:text-blue-700 cursor-pointer ${
          isActive
            ? "border-blue-700 text-blue-700 text-base font-semibold"
            : "border-white text-gray-400 text-base"
        }`}
      >
        <span>{title}</span>
      </div>
    </Link>
  );
};
