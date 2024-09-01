import { HttpMiddleware } from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { RouterBuilder } from "effect-http";
import { NodeServer } from "effect-http-node";

import { Service1 } from "@example/core/service1";
import { Service2 } from "@example/core/service2";
import { api } from "./api";
import { testRouterBuilder } from "./routers/test";

const AppLayer = Layer.mergeAll(Service1.Live, Service2.Live);

const app = RouterBuilder.make(api).pipe(
  RouterBuilder.merge(testRouterBuilder),
  RouterBuilder.build,
  HttpMiddleware.cors({
    allowedOrigins: ["http://localhost:5173"],
    credentials: true,
  })
);

app.pipe(
  Effect.tap(Effect.logInfo(`Visit: http://localhost:1337/docs#/`)),
  NodeServer.listen({ port: 1337 }),
  Effect.provide(AppLayer),
  NodeRuntime.runMain
);
