import type { server } from "typescript";

import { Service1 } from "../service1";
import { Context, Effect, Layer } from "effect";

import { Server } from "./framework";
import { Schema } from "@effect/schema";

const make = Effect.gen(function* () {
  const service1 = yield* Service1;
  yield* Effect.log("Service1 effect initialized");

  return new Server().mutation(
    "example",
    Schema.Struct({
      id: Schema.String,
    }),
    () =>
      Effect.gen(function* () {
        yield* service1.function1();
      })
  );
});

export class Service3 extends Context.Tag("core/Service3")<
  Service3,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(Service3, make).pipe(Layer.provide(Service1.Live));
}

export type ServerType = typeof server;
