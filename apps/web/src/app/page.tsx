import LocalityForm from "~/components/locality-form";

export default function Home() {
  return (
    <div className="w-full px-6 md:px-0">
      <div className="w-full border rounded-lg p-4">
        <LocalityForm />
      </div>
    </div>
  );
}
