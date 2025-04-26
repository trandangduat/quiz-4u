import { auth } from "@/lib/auth";
import UploadForm from "../components/upload-form";

export default async function Home() {
  const session = await auth();

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UploadForm user={session?.user!} />
    </div>
  );
}
