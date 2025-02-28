import { SignIn } from "~/components/sign-in";

const SignInPage = () => {
  return (
    <div className="w-full px-6 md:px-0">
      <div className="w-full border rounded-lg p-4">
        <SignIn />
      </div>
    </div>
  );
};

export default SignInPage;
