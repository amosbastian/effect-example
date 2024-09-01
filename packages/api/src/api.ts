import { Api } from "effect-http";

import { testApi } from "./routers/test/specification";

export const api = Api.make().pipe(Api.addGroup(testApi));
