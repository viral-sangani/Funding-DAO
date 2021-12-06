import Img from "next/image";
import Link from "next/link";
import React from "react";
import { useTimer } from "react-timer-hook";
import { Proposal } from "../utils/interface";

interface Props {
  proposal: Proposal;
}

export const ProposalCard: React.FC<Props> = ({ proposal }) => {
  console.log(
    `proposal.livePeriod`,
    new Date(parseInt(proposal.livePeriod) * 1000)
  );
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date(parseInt(proposal.livePeriod) * 1000),
    onExpire: () => console.warn("onExpire called"),
  });
  return (
    <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-2 md:px-2 md:w-1/2 lg:w-1/2 xl:w-1/2 my-2">
      <Link href={`/market/`} passHref>
        <div className="flex flex-col border border-gray-300 rounded-lg p-3 hover:border-blue-700 cursor-pointer">
          <div className="flex flex-col space-y-1">
            <span className="text-base">
              {proposal.title}
              <span className="text-xs bg-blue-500 text-white rounded-lg py-1 px-1 font-bold ml-2">
                Voting Period
              </span>
            </span>
            <span className="text-sm">{proposal.desc}</span>
            <span className="text-sm">
              Proposer:{" "}
              <span className="bg-gray-200 text-blue-500 00 p-1 rounded-lg">
                {proposal.proposer.substring(0, 5) +
                  "....." +
                  proposal.proposer.substring(
                    proposal.proposer.length - 4,
                    proposal.proposer.length
                  )}
              </span>
            </span>
          </div>

          <div className="flex flex-row flex-nowrap justify-between items-center mt-5">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Time</span>
              <span className="text-sm">
                <span>{days} days</span> <span>{hours}</span>:
                <span>{minutes}</span>:<span>{seconds}</span>
                {/* <span>{ampm}</span> */}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">In Favor</span>
              <span className="text-sm">{proposal.voteInFavor}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Against</span>
              <span className="text-sm">{proposal.voteAgainst}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
