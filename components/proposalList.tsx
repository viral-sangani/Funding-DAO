import React from "react";
import { useData } from "../contexts/dataContext";
import { ProposalCard } from "./proposalCard";

export const ProposalList = () => {
  const { allProposals } = useData();
  return (
    <main className="w-full flex flex-row py-4 flex-grow max-w-5xl">
      {allProposals.map((proposal) => (
        <div key={proposal.id} className="w-full">
          <ProposalCard proposal={proposal} />
        </div>
      ))}
    </main>
  );
};
