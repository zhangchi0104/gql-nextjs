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
      <div className="">
        <h1 className="text-xl font-bold">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Please sign in to use the verification service
        </p>
      </div>
      <div className="space-y-2">
        <label>Username</label>
        <Input name="username" type="text" data-testid="login__username" />
      </div>
      <div className="space-y-2">
        <label>Password</label>
        <Input name="password" type="password" data-testid="login__password" />
      </div>
      <Button type="submit" data-testid="login__submit">
        Sign In
      </Button>
    </form>
  );
}
