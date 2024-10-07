import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 테마 상태
  const [theme, setTheme] = useState("light");

  // 테마 변경 기능
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // 테마 변경에 따라 body 클래스 업데이트
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
