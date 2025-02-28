import { auth, signIn } from "~/auth";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export async function SignIn() {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <form
      className="flex flex-col gap-4"
      action={async (formData) => {
        "use server";
        await signIn("credentials", formData);
      }}
    >
      <div className="space-y-2">
        <label>Username</label>
        <Input name="username" type="text" />
      </div>
      <div className="space-y-2">
        <label>Password</label>
        <Input name="password" type="password" />
      </div>
      <Button type="submit">Sign In</Button>
    </form>
  );
}
