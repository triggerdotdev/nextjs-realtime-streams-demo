import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const batchParentTask = task({
  id: "batch-parent-task",
  run: async () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      payload: {
        id: `item${i}`,
        name: `Item Name ${i}`,
        description: `This is a description for item ${i}`,
        value: i,
        timestamp: new Date().toISOString(),
        foo: {
          id: `item${i}`,
          name: `Item Name ${i}`,
          description: `This is a description for item ${i}`,
          value: i,
          timestamp: new Date().toISOString(),
        },
        bar: {
          id: `item${i}`,
          name: `Item Name ${i}`,
          description: `This is a description for item ${i}`,
          value: i,
          timestamp: new Date().toISOString(),
        },
      },
    }));

    return await batchChildTask.batchTrigger(items);
  },
});

export const batchChildTask = task({
  id: "batch-child-task",
  retry: {
    maxAttempts: 2,
  },
  run: async (payload: any, { ctx }) => {
    logger.info("Processing child task", { payload });

    await wait.for({ seconds: 1 });

    return `${payload} - processed`;
  },
});

export const triggerWithQueue = task({
  id: "trigger-with-queue",
  run: async () => {
    await batchChildTask.trigger(
      {},
      {
        queue: {
          name: "batch-queue-foo",
        },
      }
    );
  },
});
