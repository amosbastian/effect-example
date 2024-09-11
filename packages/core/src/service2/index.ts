import { Context, Effect, Layer } from "effect";
import { Service1 } from "../service1";
import { Service3 } from "../service3";

const make = Effect.gen(function* () {
  yield* Effect.log("Service2 service initialised");

  const service1 = yield* Service1;
  const service3 = yield* Service3;

  yield* service1.function1();
  yield* service3.execute("example", { id: "1" });
});

export class Service2 extends Context.Tag("core/Service2")<
  Service2,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(Service2, make).pipe(
    Layer.provide(Service1.Live),
    Layer.provide(Service3.Live)
  );
}
