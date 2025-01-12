import axios from "axios";
import main_url from "../../api";

export const useAxios = () => {
  const response = (props) => {
    const { url, method = "GET", body, headers, params } = props;
    return axios({
      url: `${main_url}${url}`,
      method,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      params: {
        access_token: localStorage.getItem("x-auth-token"),
        ...params,
      },
    })
      .then((data) => data.data.data)
      .catch((error) => console.log(error.message, "Error"));
  };
  return response;
};
