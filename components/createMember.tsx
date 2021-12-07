import React, { useState } from "react";
import { useData } from "../contexts/dataContext";

export const CreateMember = () => {
  const { createStakeholder } = useData();
  const [val, setVal] = useState("");
  return (
    <main className="w-full flex flex-colpy-4 flex-grow max-w-5xl justify-center">
      <div className="max-w-2xl border-2 border-blue-600 rounded-xl p-3 mt-10 h-full">
        <div className="flex flex-col justify-center">
          <span>You are not a member.</span>
          <p>
            Add <strong>2 MATIC</strong> to become member and more than 2 MATIC
            become a stakeholder
          </p>
          <input
            type="search"
            name="q"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="my-5 w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
            placeholder="Amount in MATIC"
            autoComplete="off"
          />
          <button
            className="px-3 py-2 rounded-xl bg-blue-600 text-white"
            onClick={() => {
              createStakeholder(val);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
};
