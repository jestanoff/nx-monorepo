import { trpc } from "@/trpc/server";
import { ClientGreeting } from "./client-greeting";

export default async function Index() {
  void trpc.hello.prefetch({ text: "from server" });

  return (
    <div>
      <ClientGreeting />
    </div>
  );
}
