export interface Proposal {
  amount: string;
  desc: string;
  id: string;
  isCompleted: boolean;
  isPaid: boolean;
  livePeriod: string;
  paid: boolean;
  proposer: string;
  receiverAddress: string;
  title: string;
  totalFundRaised: string;
  voteAgainst: string;
  voteInFavor: string;
  imageId: string;
}