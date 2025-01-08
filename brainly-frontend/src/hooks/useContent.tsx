import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

const useContent = () => {
  const [content, setContent] = useState([]);

  function fetchContent() {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res);
        setContent(res.data.content);
      });
  }

  useEffect(() => {
    fetchContent();
    const clokc = setInterval(() => {
      fetchContent();
      console.log("fetched");
    }, 10 * 1000);

    return () => {
      clearInterval(clokc);
    };
  }, []);

  return { content, fetchContent };
};

export default useContent;
