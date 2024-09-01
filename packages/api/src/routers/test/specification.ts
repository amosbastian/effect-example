import { Effect } from "effect";
import { Api, ApiGroup, Handler } from "effect-http";

const testEndpoint = Api.post("test", "/test").pipe(
  Api.addResponse({ status: 204 })
);

export const testHandler = Handler.make(testEndpoint, () =>
  Effect.succeed({ status: 204 as const })
);

export const testApi = ApiGroup.make("Test").pipe(
  ApiGroup.addEndpoint(testEndpoint)
);
