import React, {useMemo} from 'react';
import {View} from 'react-native';
import {calcTimeOffsetForRange} from './helpers/presenter';
import {HOUR_BLOCK_HEIGHT} from './Packer';
const NowIndicator = props => {
  const {styles, width, left, start} = props;
  const indicatorPosition = calcTimeOffsetForRange(HOUR_BLOCK_HEIGHT, undefined, undefined, start);
  const nowIndicatorStyle = useMemo(() => {
    return [styles.nowIndicator, {top: indicatorPosition + 24, left}];
  }, [indicatorPosition, left]);
  return (
    <View style={nowIndicatorStyle}>
      <View style={[styles.nowIndicatorLine, {width}]} />
      <View style={[styles.nowIndicatorKnob, {left: 4}]} />
    </View>
  );
};
export default NowIndicator;
