// @flow
declare module 'highland' {
  declare type Push<A> = ((err: ?Error) => void)
                       & ((err: null, result: A) => void);
  declare type Next<A> = (() => void)
                       & (Stream<A> => void);

  declare class Stream<A> {

    map<B>(f: A => B): Stream<B>;
    merge<B>(): Stream<B>;
    parallel<B>(n: number): Stream<B>;
    through<B>(target: Stream<A> => Stream<B>): Stream<B>;
    errors(f: (Error, Push<A>) => void): Stream<A>;
    each(f: A => void): Stream<A>;
  }

  declare module.exports: {
    <A>(xs: Array<A>): Stream<A>,
    <A>(promise: Promise<A>): Stream<A>,
    <A>(generator: (Push<A>, Next<A>) => void): Stream<A>,
    Stream: typeof Stream,
  };
}
