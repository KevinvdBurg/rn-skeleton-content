import Animated, {
  Adaptable,
  add,
  and,
  block,
  Clock,
  clockRunning,
  cond,
  not,
  set,
  startClock,
  timing,
  Value
} from 'react-native-reanimated';

export type LoopProps = {
  clock?: Clock;
  easing?: (v: Adaptable<number>) => Animated.Node<number>;
  duration?: number;
  boomerang?: boolean;
  autoStart?: boolean;
};

export const loop = (loopConfig: LoopProps) => {
  const { clock, easing, duration, boomerang, autoStart } = {
    clock: new Clock(),
    duration: 250,
    boomerang: false,
    autoStart: true,
    easing: (v: Animated.Adaptable<number>) => add(v, 0),
    ...loopConfig
  };
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };
  const config = {
    toValue: new Value(1),
    duration,
    easing
  };

  return block([
    cond(and(not(clockRunning(clock)), autoStart ? 1 : 0), startClock(clock)),
    timing(clock, state, config),
    cond(state.finished, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      boomerang
        ? set(config.toValue, cond(config.toValue, 0, 1))
        : set(state.position, 0)
    ]),
    state.position
  ]);
};
