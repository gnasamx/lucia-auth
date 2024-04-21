import { signUp } from "@/app/actions/sign-up";

const SignUpRoute = () => {
  return (
    <div>
      <h1>Create account</h1>
      <form action={signUp}>
        <div>
          <label htmlFor="name">Email </label>
          <input
            type="email"
            name="email"
            required
            defaultValue={"gnasamx@gmail.com"}
          />
        </div>
        <br />
        <button type="submit">Continue with Email</button>
      </form>
    </div>
  );
};

export default SignUpRoute;
