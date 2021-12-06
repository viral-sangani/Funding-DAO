import React from "react";
import { useData } from "../contexts/dataContext";

export const CreateProposal = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const { createProposal } = useData();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createProposal({
      title,
      description,
      amount,
      recipient,
    });
    setTitle("");
    setDescription("");
    setAmount("");
    setRecipient("");
  };

  return (
    <main className="w-full flex flex-colpy-4 flex-grow max-w-5xl justify-center items-center">
      <div className="w-3/4 border-2 border-blue-600 rounded-xl p-3 mt-10">
        <div className="flex flex-col justify-center">
          <span className="text-xl text-center">Create a new Proposal</span>
          <p className="mt-4">
            You will need to lock 5 MATIC to create proposal.
          </p>
          <p className="text-sm mb-4">
            If proposal is accepted, you will be refunded 5 MATIC and if
            proposal is rejected, 5 MATIC will go to DAO treasury.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="my-2 w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              placeholder="Title"
              autoComplete="off"
              required
            />
            <textarea
              placeholder="Describe your project here"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="my-2 w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
            ></textarea>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="my-2 w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              placeholder="Funding Receiver's Address"
              autoComplete="off"
              required
            />

            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="my-2 w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              placeholder="Funding Amount"
              autoComplete="off"
              required
            />

            <button
              className="mt-3 px-3 py-2 rounded-xl bg-blue-600 text-white"
              type="submit"
            >
              Create Proposal
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
