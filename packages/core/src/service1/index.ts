import { Context, Effect, Layer } from "effect";

const make = Effect.gen(function* () {
  yield* Effect.log("Service1 service initialised");

  const function1 = () =>
    Effect.gen(function* () {
      yield* Effect.log("function1");
    });

  const function2 = () =>
    Effect.gen(function* () {
      yield* Effect.log("function2");
    });

  return { function1, function2 };
});

export class Service1 extends Context.Tag("core/Service1")<
  Service1,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(Service1, make);
}
