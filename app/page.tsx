import { auth } from "@/lib/auth";
import UploadForm from "../components/upload-form";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <UploadForm user={session?.user!} />
    </>
  );
}
