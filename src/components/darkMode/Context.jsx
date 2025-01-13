import { createContext,useState  } from "react";
const Context = createContext()

const ContextProvider = ({ children }) => {
    const [theme, setTheme] = useState(false);
    return <Context.Provider  value={{theme, setTheme}}>{children}</Context.Provider>
}
export { Context, ContextProvider}