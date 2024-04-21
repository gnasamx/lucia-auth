import { cookies } from "next/headers";
import { verify } from "@/app/actions/verify";

const VerifyRoute = () => {
  const email = cookies().get("auth:email")?.value;
  return (
    <main>
      <h1>Check your email</h1>
      <p>We&apos;ve sent a code.</p>
      {email && (
        <p>
          Please check your inbox at <b>{email}</b>
        </p>
      )}

      <form action={verify}>
        <div>
          <label htmlFor="code">Code </label>
          <input type="text" name="code" required />
        </div>
        <br />
        <button type="submit">Create account</button>
      </form>
    </main>
  );
};

export default VerifyRoute;
