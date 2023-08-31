import * as React from 'react';
import { useMemo } from 'react';
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { View } from 'react-native';
import {
  DEFAULT_ANIMATION_DIRECTION,
  DEFAULT_ANIMATION_TYPE,
  DEFAULT_BONE_COLOR,
  DEFAULT_DURATION,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_LOADING,
  styles
} from './Constants';
import {
  IPureSkeletonContentPropsFields,
  ISkeletonContentProps,
  ISkeletonMeta
} from './types';
import { getBones, useLayout } from './utils';

const SkeletonContent: React.FunctionComponent<ISkeletonContentProps &
  Partial<IPureSkeletonContentPropsFields>> = ({
  containerStyle = styles.container,
  duration = DEFAULT_DURATION,
  layout = [],
  animationType = DEFAULT_ANIMATION_TYPE,
  animationDirection = DEFAULT_ANIMATION_DIRECTION,
  isLoading = DEFAULT_LOADING,
  boneColor = DEFAULT_BONE_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  children,
  component: Component,
  componentProps
}) => {
  let animationValue = useSharedValue(0);

  const [componentSize, onLayout] = useLayout();

  animationValue = useDerivedValue(() => {
    if (isLoading) return 0;
    if (animationType === 'shiver') {
      return withRepeat(withTiming(duration!), -1);
    }
    return withRepeat(withTiming(duration! / 2), -1);
  }, [isLoading, animationType, duration]);

  const skeletonMeta = useMemo<ISkeletonMeta>(
    () => ({
      size: componentSize,
      animationType,
      highlightColor,
      boneColor,
      animationDirection
    }),
    [
      animationDirection,
      animationType,
      boneColor,
      componentSize,
      highlightColor
    ]
  );

  const bones = useMemo(() => {
    return isLoading
      ? getBones(layout, children, '', animationValue, skeletonMeta)
      : null;
  }, [animationValue, children, isLoading, layout, skeletonMeta]);

  const getComponent = () =>
    Component ? <Component {...componentProps} /> : children;

  return (
    <View style={containerStyle} onLayout={onLayout}>
      {isLoading ? bones : getComponent()}
    </View>
  );
};

export default React.memo(SkeletonContent);
