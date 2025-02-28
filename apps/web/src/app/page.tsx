import { auth, signOut } from "~/auth";
import LocalityForm from "~/components/locality-form";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div className="w-full px-6 md:px-0">
      <div className="w-full border rounded-lg p-4 flex flex-col">
        <LocalityForm />
        <form
          className="mt-4 mx-auto"
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit">Sign Out</Button>
        </form>
      </div>
    </div>
  );
}
