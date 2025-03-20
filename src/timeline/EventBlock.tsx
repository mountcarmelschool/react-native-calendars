import XDate from 'xdate';
import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {View, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

export interface Event {
  id?: string;
  start: string;
  end: string;
  title: string;
  summary?: string;
  color?: string;
  backgroundColor?: string;
}

export interface PackedEvent extends Event {
  index: number;
  left: number;
  top: number;
  width: number;
  height: number | undefined;
}

export interface EventBlockProps {
  index: number;
  event: PackedEvent;
  onPress: (eventIndex: number) => void;
  renderEvent?: (event: PackedEvent) => JSX.Element;
  format24h?: boolean;
  styles: {[key: string]: ViewStyle | TextStyle};
  testID?: string;
}

const TEXT_LINE_HEIGHT = 17;
const EVENT_DEFAULT_COLOR = '#add8e6';

const EventBlock = (props: EventBlockProps) => {
  const {index, event, renderEvent, onPress, format24h, styles} = props;

  // Fixing the number of lines for the event title makes this calculation easier.
  // However it would make sense to overflow the title to a new line if needed
  const numberOfLines = event.height ? Math.floor(event.height / TEXT_LINE_HEIGHT) : 1;
  const formatTime = format24h ? 'HH:mm' : 'hh:mm TT';
  const eventStyle = useMemo(() => {
    return {
      left: event.left,
      height: event.height,
      width: event.width,
      top: event.top,
      backgroundColor: event.backgroundColor || event.color || EVENT_DEFAULT_COLOR
    };
  }, [event]);

  const eventTextStyle = useMemo(() => {
    return {
      color: event.backgroundColor ? event.color : undefined,
    };
  }, [event]);

  const _onPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  return (
    <TouchableOpacity testID={props.testID} activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle]}>
      {renderEvent ? (
        renderEvent(event)
      ) : (
        <View>
          <Text numberOfLines={1} style={[styles.eventTitle, eventTextStyle]}>
            {event.title || 'Event'}
          </Text>
          {numberOfLines > 1 ? (
            <Text numberOfLines={numberOfLines - 1} style={[styles.eventSummary, eventTextStyle]}>
              {event.summary || ' '}
            </Text>
          ) : null}
          {numberOfLines > 2 ? (
            <Text style={[styles.eventTimes, eventTextStyle]} numberOfLines={1}>
              {new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

export interface EmptyEventBlockProps {
  style: ViewStyle;
  styles: {[key: string]: ViewStyle | TextStyle};
}

export const EmptyEventBlock = (props: EmptyEventBlockProps) => {
  const {style, styles} = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(true);
    }, 700);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;
  return (
    <View style={[styles.emptyEvent, style]}>
      <Text numberOfLines={1} style={styles.emptyEventTitle}>
          Data not available!
      </Text>
    </View>
  );
};

export default EventBlock;
