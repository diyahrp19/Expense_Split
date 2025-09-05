import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="p-6 bg-white rounded-2xl shadow w-[320px] text-center">
        <h1 className="text-xl font-semibold mb-4">Expense Splitter</h1>
        <button
          onClick={login}
          className="w-full py-2 rounded-xl bg-black text-white"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
