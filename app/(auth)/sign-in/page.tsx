import { signIn } from "@/app/actions/sign-in";

const SignUpRoute = () => {
  return (
    <div>
      <h1>Sign in</h1>
      <form action={signIn}>
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
