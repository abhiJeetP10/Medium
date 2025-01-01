import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@abhijeetp/common-app";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();

  const [postInput, setPostInput] = useState<SignupInput>({
    email: "",
    password: "",
    name: "",
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/${type === "signin" ? "signin" : "signup"}`,
        postInput
      );
      const jwt = response.data;
      console.log(jwt.token);
      localStorage.setItem("token", `Bearer ${jwt.token}`);
      navigate("/blogs");
    } catch (e) {
      showAlert(
        `${
          type === "signin" ? "Signin" : "Signup"
        } was unsuccessful. Please try again.`,
        "error"
      );
    }
  }

  function showAlert(message: string, alertType: "success" | "error") {
    const alertDiv = document.createElement("div");
    alertDiv.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
      alertType === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <div className="text-4xl font-extrabold">
        {type === "signin" ? "Login to your account" : "Create an account"}
      </div>
      <div className="text-slate-500 pt-2 pb-5">
        {type === "signin"
          ? "Don't have an account?"
          : "Already have an account?"}
        <Link
          className="pl-1 underline"
          to={type === "signin" ? "/signup" : "/"}
        >
          {type === "signin" ? "Signup" : "Login"}
        </Link>
      </div>
      {type === "signup" && (
        <LabelledInput
          label="Name"
          placeholder="John Doe"
          onChange={(e) => {
            setPostInput((c) => ({
              ...c,
              name: e.target.value,
            }));
          }}
          type="text"
        />
      )}
      <LabelledInput
        label="Email"
        placeholder="johnDoe@xyz.com"
        onChange={(e) => {
          setPostInput((c) => ({
            ...c,
            email: e.target.value,
          }));
        }}
        type="email"
      />
      <LabelledInput
        label="Password"
        placeholder=""
        onChange={(e) => {
          setPostInput((c) => ({
            ...c,
            password: e.target.value,
          }));
        }}
        type="password"
      />
      <button
        type="button"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-5 w-1/2 ml-2"
        onClick={sendRequest}
      >
        {type === "signin" ? "Sign In" : "Sign Up"}
      </button>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div className="w-1/2 pt-3">
      <label className="block mb-2 font-semibold">{label}</label>
      <input
        type={type || "text"}
        id={label}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
        onChange={onChange}
      />
    </div>
  );
}
