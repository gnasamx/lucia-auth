import { createWorkspace } from "@/app/actions/setup";

const SetupRoute = () => {
  return (
    <div>
      <h1>Create a new workspace</h1>
      <p>
        Workspaces are shared environments where team members can track time on
        projects.
      </p>
      <form action={createWorkspace}>
        <div>
          <label htmlFor="name">Workspace Name </label>
          <input type="text" name="name" required />
        </div>
        <div>
          <label htmlFor="slug">Workspace URL </label>
          <input type="text" name="slug" required />
        </div>
        <br />
        <button type="submit">Create workspace</button>
      </form>
    </div>
  );
};

export default SetupRoute;
