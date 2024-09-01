import { RouterBuilder } from "effect-http";

import { api } from "../../api";
import { testHandler } from "./specification";

export const testRouterBuilder = RouterBuilder.make(api).pipe(RouterBuilder.handle(testHandler));
