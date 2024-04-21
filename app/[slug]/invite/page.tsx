import { invite } from "@/app/actions/invite";

const SignInRoute = () => {
  return (
    <div>
      <h1>Invite your teammate</h1>
      <form action={invite}>
        <div>
          <label htmlFor="name">Email </label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label htmlFor="role">Role </label>
          <select name="role">
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>
        <br />
        <button type="submit">Invite teammate</button>
      </form>
    </div>
  );
};

export default SignInRoute;
