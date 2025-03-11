import React, {useMemo} from 'react';
import {View, TextStyle, ViewStyle} from 'react-native';
import {calcTimeOffsetForRange} from './helpers/presenter';
import {HOUR_BLOCK_HEIGHT} from './Packer';

export interface NowIndicatorProps {
  styles: {[key: string]: ViewStyle | TextStyle};
  width: number;
  left: number;
  start: number;
  end: number;
}

const NowIndicator = (props: NowIndicatorProps) => {
  const {styles, width, left, start, end} = props;

  const indicatorPosition = calcTimeOffsetForRange(HOUR_BLOCK_HEIGHT, undefined, undefined, start, end);

  const nowIndicatorStyle = useMemo(() => {
    return [styles.nowIndicator, {top: indicatorPosition + 24, left}];
  }, [indicatorPosition, left]);

  return (
    <View style={nowIndicatorStyle}>
      <View style={[styles.nowIndicatorLine, {width}]}/>
      <View style={[styles.nowIndicatorKnob, {left:4}]}/>
    </View>
  );
};

export default NowIndicator;
