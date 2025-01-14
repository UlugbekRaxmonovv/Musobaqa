import React, { useContext } from "react";
import EmployeesComponents from "../../../components/employes/employes-main";
import { Context } from "../../../components/darkMode/Context";

const Employees = () => {
  const { theme } = useContext(Context);
  return (
    <div
      className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
          py-8 px-2 min-h-[100%] transition-all 
          rounded-lg`}
    >
      <EmployeesComponents />
    </div>
  );
};

export default Employees;
