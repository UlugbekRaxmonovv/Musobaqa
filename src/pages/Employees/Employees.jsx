import React, { useContext } from "react";
import EmployesComponents from "../../components/employes/employes-main";
import { Context } from "../../components/darkMode/Context";

const Employees = () => {
  const { theme } = useContext(Context);
  return (
    <div
    className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
          p-4 min-h-[100%] transition-all 
          rounded-lg`}
  >
      <EmployesComponents />
    </div>
  );
};

export default Employees;
