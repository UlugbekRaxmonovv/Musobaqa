import axios from "axios";

const main_url = axios.create({
baseURL: "http://localhost:3000", 

});
export default main_url;