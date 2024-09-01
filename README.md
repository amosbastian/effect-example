Showing a problem with import maps causing duplicate services in Effect

```
cd packages/core
pnpm build
```

```
cd packages/api
pnpm dev
```

Output:

```
[23:32:59.857] INFO (#2): Service2 service initialised
[23:32:59.858] INFO (#2): Service1 service initialised
[23:32:59.861] INFO (#3): Service2 service initialised
[23:32:59.873] INFO (#0): Listening on http://0.0.0.0:1337
```

If you change

```
import { Service2 } from "#service2";
```

to

```
import { Service2 } from "../service2";
```

it will output

```
[23:33:13.650] INFO (#2): Service2 service initialised
[23:33:13.652] INFO (#2): Service1 service initialised
[23:33:13.671] INFO (#0): Listening on http://0.0.0.0:1337
```
