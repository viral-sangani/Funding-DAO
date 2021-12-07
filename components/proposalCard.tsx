import Img from "next/image";
import Link from "next/link";
import React from "react";
import { useTimer } from "react-timer-hook";
import Web3 from "web3";
import { useData } from "../contexts/dataContext";
import { Proposal } from "../utils/interface";

interface Props {
  proposal: Proposal;
  openModal: () => void;
}
export const ProposalCard: React.FC<Props> = ({ proposal, openModal }) => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date(parseInt(proposal.livePeriod) * 1000),
    onExpire: () => console.warn("onExpire called"),
  });
  const { isStakeholder, getProposal } = useData();
  const isCompleted =
    new Date(parseInt(proposal.livePeriod) * 1000) < new Date();
  console.log(`isCompleted`, isCompleted);
  return (
    <div
      className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-2 md:px-2 md:w-1/2 lg:w-1/2 xl:w-1/2 my-2"
      onClick={async () => {
        if (isStakeholder) {
          console.log("isStakeholder");
          var data: Proposal = await getProposal(proposal.id);
          console.log(`data`, data);
          openModal();
        }
      }}
    >
      <div className="flex flex-col border-2 border-gray-300 rounded-lg p-3 hover:border-blue-700">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-500 inline-flex justify-between ">
            Proposal - #{parseInt(proposal.id) + 1}
            <span>
              Funding Amount -{" "}
              <span className="text-blue-600">
                {Web3.utils.fromWei(proposal.amount)} MATIC
              </span>
            </span>
          </span>
          <span className="text-lg font-bold inline-flex justify-between mt-2">
            {proposal.title}
            <span className="text-xs bg-blue-500 text-white rounded-lg py-1 px-1 font-bold ml-2 h-6">
              Voting Period
            </span>
          </span>
          <span className="text-sm line-clamp-3 mt-4 mb-6">
            {proposal.desc}
          </span>
          <span className="text-sm">
            Proposer:{" "}
            <span className="bg-gray-200 text-blue-500 00 p-1 rounded-lg">
              {proposal.proposer}
            </span>
          </span>
        </div>

        <div className="flex flex-row flex-nowrap justify-between items-center mt-5">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-bold">Time</span>
            {isCompleted ? (
              <span className="text-xs font-bold">Voting period is over.</span>
            ) : (
              <span className="text-sm">
                <span>{days} days</span> <span>{hours}</span>:
                <span>{minutes}</span>:<span>{seconds}</span>
                {/* <span>{ampm}</span> */}
              </span>
            )}
          </div>
          {isCompleted ? (
            <span className="text-base font-bold">
              Proposal is{" "}
              {parseInt(proposal.voteInFavor) > parseInt(proposal.voteAgainst)
                ? "Accepted"
                : "Rejected"}
            </span>
          ) : (
            <>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500 font-bold">
                  In Favor
                </span>
                <span className="text-sm">{proposal.voteInFavor}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500 font-bold">Against</span>
                <span className="text-sm">{proposal.voteAgainst}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
