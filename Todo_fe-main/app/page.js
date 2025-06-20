"use client";
import { useEffect, useState } from "react";
import Todo from "./components/todo";

export default function Home() {
  const [userData, setUserData] = useState({});
  const [toggleLogin, setToggleLogin] = useState(false);
  const [togglePage, setTogglePage] = useState(false);
  const [getAllTodo, setGetAllTodo] = useState();
  useEffect(() => {
    if (togglePage) {
      getTodo();
    }
  }, [togglePage]);

  const getTodo = async () => {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const item = localStorage.getItem("token");
    let token;

    if (item) {
      token = JSON.parse(item);
      token = token.token;
    }
    const response = await fetch(`${base_url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
    if (res) {
      console.log("getting all todo", res, response);

      setGetAllTodo(res);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setTogglePage(false);
  };
  const handleLogin = async (e) => {
    if (!togglePage) {
      delete userData.name;
    }
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    e.preventDefault();
    try {
      console.log("data", userData, base_url);

      const response = await fetch(`${base_url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const res = await response.json();
      console.log("loginishere", res);
      localStorage.setItem("token", JSON.stringify(res));
      if (res.token) {
        setTogglePage(true);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("signup");
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
      console.log("data", userData, base_url);

      const response = await fetch(`${base_url}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const res = await response.json();
      console.log("loginishere", res);
      localStorage.setItem("token", JSON.stringify(res));
      if (res.email) {
        setToggleLogin(false);
      }
    } catch (err) {
      console.log("error", err);
    }
  };
  return (
    <>
      {togglePage && (
        <div className=" w-full h-12 flex  pr-2  pt-2 justify-end">
          {" "}
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 font-bold  rounded hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      )}
      {togglePage === false ? (
        <>
          <div className=" w-full h-screen flex  items-center justify-center ">
            <div className="flex w-1/2 h-96  flex-col  items-center">
              <h1 className=" font-bold text-lg">
                {toggleLogin ? "Sign Up" : "Login"}
              </h1>
              <form
                className="flex flex-col w-full  items-center"
                action=""
                onSubmit={toggleLogin ? handleSignUp : handleLogin}
              >
                {toggleLogin ? (
                  <input
                    type="text"
                    className="  pl-2  w-1/2 mt-2 h-10 text-black outline-none  rounded-lg "
                    placeholder="Enter your name"
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                ) : null}

                <input
                  type="email"
                  className="  pl-2  w-1/2 mt-4 h-10 text-black outline-none  rounded-lg "
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />

                <input
                  type="text"
                  className=" pl-2 w-1/2 mt-4 h-10 text-black outline-none  rounded-lg"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
                <div className="w-full items-center flex flex-col justify-center mt-4 ">
                  <button
                    type="submit"
                    className="w-20 rounded-lg h-12 bg-blue-600"
                  >
                    {toggleLogin ? "Sign Up" : "Login"}
                  </button>
                  <div className=" mt-2">
                    New user ?{" "}
                    <button
                      onClick={() => setToggleLogin(!toggleLogin)}
                      className=" text-blue-600"
                    >
                      {toggleLogin ? "Login" : "Sign Up"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <Todo data={getAllTodo} />
      )}
    </>
  );
}
