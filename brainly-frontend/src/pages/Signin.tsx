import { useRef, useState } from "react";
import { Button } from "../components/Button";
import InputComponent from "../components/InputComponent";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const usernameref = useRef<HTMLInputElement>(null);
  const passwordref = useRef<HTMLInputElement>(null);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  async function signin() {
    setLoad(true);
    const username = usernameref.current?.value;
    const password = passwordref.current?.value;
    console.log(username, password);
    const res = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username,
      password: password,
    });
    // alert("sign in ran");
    console.log(res.data.token);
    
    const jwt = res.data.token;
    localStorage.setItem("token", jwt);
    setLoad(false);

    navigate("/dashboard")
    usernameref.current.value = "";
    passwordref.current.value = "";
  }
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white rounded-xl border min-w-48 p-8">
        <InputComponent ref={usernameref} placeholder="Username" />
        <InputComponent ref={passwordref} placeholder="Password" />
        <div className="flex justify-center pt-4">
          <Button
            onClick={signin}
            loading={load}
            variant="primary"
            text="Signin"
            fullwidth={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
