/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Schema } from "@effect/schema";
import type { WriteTransaction } from "replicache";

interface Mutation<Name extends string = string, Input = any> {
  name: Name;
  input: Input;
}

export class Server<
  Mutations extends Record<string, Mutation> = NonNullable<unknown>
> {
  private mutations = new Map<
    string,
    {
      input: Schema.Schema.Any;
      fn: (input: any) => any;
    }
  >();

  public mutation<Name extends string, Shape extends Schema.Schema.Any>(
    name: Name,
    shape: Shape,
    fn: (input: Schema.Schema.Type<Shape>) => any
  ): Server<
    Mutations & {
      [K in Name]: { name: Name; input: Schema.Schema.Type<Shape> };
    }
  > {
    this.mutations.set(name, {
      fn: (args) => {
        const parsed = args;
        return fn(parsed as Schema.Schema.Type<Shape>);
      },
      input: shape,
    });
    return this as any;
  }

  public expose<Name extends string, Shape extends Schema.Schema.Any>(
    name: Name,
    fn: ((input: Schema.Schema.Type<typeof Schema.Any>) => any) & {
      schema: Shape;
    }
  ): Server<
    Mutations & {
      [K in Name]: { name: Name; input: Schema.Schema.Type<Shape> };
    }
  > {
    this.mutations.set(name, {
      fn,
      input: fn.schema,
    });
    return this as any;
  }

  public execute<Name extends keyof Mutations>(
    name: Name,
    args: Mutations[Name]["input"]
  ): any {
    const mut = this.mutations.get(name as string);
    if (!mut) throw new Error(`Mutation "${String(name)}" not found`);
    return mut.fn(args);
  }
}

// Add more mutations here as needed
type ExtractMutations<S extends Server<any>> = S extends Server<infer M>
  ? M
  : never;

export class Client<
  S extends Server<any>,
  Mutations extends Record<string, Mutation> = ExtractMutations<S>
> {
  private mutations = new Map<string, (...input: any[]) => any>();

  public mutation<Name extends keyof Mutations>(
    name: Name,
    fn: (tx: WriteTransaction, input: Mutations[Name]["input"]) => any
  ) {
    this.mutations.set(name as string, fn);
    return this;
  }

  public build(): {
    [key in keyof Mutations]: (
      ctx: WriteTransaction,
      args: Mutations[key]["input"]
    ) => any;
  } {
    return Object.fromEntries(this.mutations.entries()) as any;
  }
}
