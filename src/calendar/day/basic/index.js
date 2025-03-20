import React, {Fragment, useCallback, useRef} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {xdateToData} from '../../../interface';
import Marking from '../marking';
import styleConstructor from './style';
const BasicDay = props => {
  const {
    theme,
    date,
    onPress,
    onLongPress,
    markingType,
    marking,
    state,
    disableAllTouchEventsForDisabledDays,
    disableAllTouchEventsForInactiveDays,
    accessibilityLabel,
    children,
    testID
  } = props;
  const dateData = date ? xdateToData(date) : undefined;
  const style = useRef(styleConstructor(theme));
  const _marking = marking || {};
  const isSelected = _marking.selected || state === 'selected';
  const isDisabled = typeof _marking.disabled !== 'undefined' ? _marking.disabled : state === 'disabled';
  const isInactive = typeof marking?.inactive !== 'undefined' ? marking.inactive : state === 'inactive';
  const isToday = typeof marking?.today !== 'undefined' ? marking.today : state === 'today';
  const isTodaySelected = state === 'today-selected';
  const isMultiDot = markingType === Marking.markings.MULTI_DOT;
  const isMultiPeriod = markingType === Marking.markings.MULTI_PERIOD;
  const isCustom = markingType === Marking.markings.CUSTOM;
  const shouldDisableTouchEvent = () => {
    const {disableTouchEvent} = _marking;
    let disableTouch = false;
    if (typeof disableTouchEvent === 'boolean') {
      disableTouch = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
      disableTouch = disableAllTouchEventsForDisabledDays;
    } else if (typeof disableAllTouchEventsForInactiveDays === 'boolean' && isInactive) {
      disableTouch = disableAllTouchEventsForInactiveDays;
    }
    return disableTouch;
  };
  const getContainerStyle = () => {
    const {customStyles, selectedColor} = _marking;
    const styles = [style.current.base];
    if (isTodaySelected) {
      styles.push(style.current.selectedToday);
    } else if (isSelected) {
      styles.push(style.current.selected);
      if (selectedColor) {
        styles.push({backgroundColor: selectedColor});
      }
    } else if (isToday) {
      styles.push(style.current.today);
    }
    //Custom marking type
    if (isCustom && customStyles && customStyles.container) {
      if (customStyles.container.borderRadius === undefined) {
        customStyles.container.borderRadius = 16;
      }
      styles.push(customStyles.container);
    }
    return styles;
  };
  const getTextStyle = () => {
    const {customStyles, selectedTextColor} = _marking;
    const styles = [style.current.text];
    if (isSelected || isTodaySelected) {
      styles.push(style.current.selectedText);
      if (selectedTextColor) {
        styles.push({color: selectedTextColor});
      }
    } else if (isDisabled) {
      styles.push(style.current.disabledText);
    } else if (isToday) {
      styles.push(style.current.todayText);
    } else if (isInactive) {
      styles.push(style.current.inactiveText);
    }
    // Custom marking type
    if (isCustom && customStyles && customStyles.text) {
      styles.push(customStyles.text);
    }
    return styles;
  };
  const _onPress = useCallback(() => {
    onPress?.(dateData);
  }, [onPress, date]);
  const _onLongPress = useCallback(() => {
    onLongPress?.(dateData);
  }, [onLongPress, date]);
  const renderMarking = () => {
    const {marked, dotColor, dots, periods} = _marking;
    return (
      <Marking
        type={markingType}
        theme={theme}
        marked={isMultiDot ? true : marked}
        selected={isSelected}
        disabled={isDisabled}
        inactive={isInactive}
        today={isToday}
        dotColor={dotColor}
        dots={dots}
        periods={periods}
      />
    );
  };
  const renderText = () => {
    return (
      <Text allowFontScaling={false} style={getTextStyle()}>
        {String(children)}
      </Text>
    );
  };
  const renderEvents = () => {
    if (!Array.isArray(_marking.events) || _marking.events.length <= 0) {
      return null;
    }
    const fade = isDisabled || isInactive;
    const fadeStyle = {opacity: fade ? 0.5 : 1};
    return (
      <View style={[style.current.events, fadeStyle]}>
        {_marking.events?.map((event, index) => (
          <View
            key={event.id || index}
            style={[style.current.eventTextContainer, {backgroundColor: event.backgroundColor || event.color}]}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="clip"
              style={[style.current.eventText, {color: event.backgroundColor ? event.color : undefined}]}
            >
              {event.summary}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  const renderContent = () => {
    return (
      <Fragment>
        {renderText()}
        {renderMarking()}
        {renderEvents()}
      </Fragment>
    );
  };
  const renderContainer = () => {
    const {activeOpacity} = _marking;
    return (
      <TouchableOpacity
        testID={testID}
        style={getContainerStyle()}
        activeOpacity={activeOpacity}
        disabled={shouldDisableTouchEvent()}
        onPress={!shouldDisableTouchEvent() ? _onPress : undefined}
        onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined}
        accessible
        accessibilityRole={isDisabled ? undefined : 'button'}
        accessibilityLabel={accessibilityLabel}
      >
        {isMultiPeriod ? renderText() : renderContent()}
      </TouchableOpacity>
    );
  };
  const renderPeriodsContainer = () => {
    return (
      <View style={style.current.container}>
        {renderContainer()}
        {renderMarking()}
      </View>
    );
  };
  return isMultiPeriod ? renderPeriodsContainer() : renderContainer();
};
export default BasicDay;
BasicDay.displayName = 'BasicDay';
