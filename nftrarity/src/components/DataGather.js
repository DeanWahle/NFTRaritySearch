import React from "react";
import axios from "axios";

const DataGather = (props) => {
  //   const ApiFunction = async (contract) => {
  //     //console.log("This is the callback " + contract);
  //     const response = await axios.get(
  //       "https://api.opensea.io/api/v1/asset_contract/" + contract,
  //       {}
  //     );
  //     console.log(response);
  //   };
  return (
    <div>
      {props.contractAddress === "" ? (
        <div>Search for a contract</div>
      ) : (
        <div>{props.contractAddress}</div>
      )}
    </div>
  );
};

export default DataGather;
