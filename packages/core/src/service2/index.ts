import { Context, Effect, Layer } from "effect";

const make = Effect.gen(function* () {
  yield* Effect.log("Service2 service initialised");
});

export class Service2 extends Context.Tag("core/Service2")<
  Service2,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(Service2, make);
}
