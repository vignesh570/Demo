/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import { AuthContext } from "../../context/auth-context";
import ApiClient from "../../network/api-client";
import apiProvider from "../../network/api-provider";

function LoginPage() {
  const authContext = useContext(AuthContext);
  localStorage.clear();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    initialValues: { email: "", password: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "password more than 8 letters" : null,
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const data = {
        email: values.email,
        password: values.password,
      };
      let result = await ApiClient.post<any>("auth", data);
      let statusCode = result?.status ?? 0;
      if (statusCode == 200 || statusCode == 201) {
        if (result.data?.data) {
          let message = "Login Successfully";
          authContext?.login(result?.data?.data);
          apiProvider.showAlert(message, true);
          navigate("/dashboard");
        }
      } else {
        let message = result?.data?.message ?? "Login failed";
        apiProvider.showAlert(message, false);
        setLoading(false);
      }
    } catch (error: any) {
      apiProvider.axiosError(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="flex flex-col space-y-3 px-6 pt-6 pb-8 bg-white shadow-md rounded-lg">
            <div className="flex items-center text-xl font-semibold justify-center text-black">
              Login
            </div>
            <div>
              <TextInput
                {...form.getInputProps("email")}
                variant="filled"
                className="w-96"
                placeholder="Enter Email"
                label="Email"
                withAsterisk
              />
            </div>
            <div>
              <PasswordInput
                {...form.getInputProps("password")}
                variant="filled"
                placeholder="Enter Password"
                label="Password"
                withAsterisk
              />
            </div>
            <div className="">
              <Button loading={loading} type="submit" className="w-96 mt-2">
                Login
              </Button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
