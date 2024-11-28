import TriggerButtonWithStreaming from "@/components/TriggerButtonWithStreaming";
import { auth } from "@trigger.dev/sdk/v3";

export default async function WeatherPage() {
  const publicAccessToken = await auth.createPublicToken({
    scopes: {
      write: {
        tasks: ["openai-streaming"],
      },
    },
  });

  return (
    <main className="grid grid-rows-[1fr_auto] min-h-screen items-center justify-center w-full bg-gray-900">
      <div className="flex flex-col space-y-8">
        <TriggerButtonWithStreaming accessToken={publicAccessToken} />
      </div>
    </main>
  );
}
