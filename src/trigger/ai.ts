import { openai } from "@ai-sdk/openai";
import { logger, metadata, schemaTask, toolTask } from "@trigger.dev/sdk/v3";
import { streamText, type TextStreamPart } from "ai";
import { z } from "zod";

export type STREAMS = {
  openai: TextStreamPart<{ getWeather: typeof weatherTask.tool }>;
};

export const weatherTask = toolTask({
  id: "weather",
  description: "Get the weather for a location",
  parameters: z.object({
    location: z.string(),
  }),
  run: async ({ location }) => {
    // return mock data
    return {
      location,
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    };
  },
});

export const aiWeather = schemaTask({
  id: "ai-weather",
  description: "Send the fullStream from the ai SDK to the metadata system",
  schema: z.object({
    model: z.string().default("gpt-4o-mini"),
    prompt: z.string().default("Hello, how are you?"),
  }),
  run: async ({ model, prompt }) => {
    logger.info("Running OpenAI model", { model, prompt });

    const result = streamText({
      model: openai(model),
      prompt,
      tools: {
        getWeather: weatherTask.tool,
      },
      maxSteps: 10,
    });

    const stream = await metadata.stream("openai", result.fullStream);

    let text = "";

    for await (const chunk of stream) {
      logger.log("Received chunk", { chunk });

      if (chunk.type === "text-delta") {
        text += chunk.textDelta;
      }
    }

    return { text };
  },
});
