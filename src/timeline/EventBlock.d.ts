import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
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
    styles: {
        [key: string]: ViewStyle | TextStyle;
    };
    testID?: string;
}
declare const EventBlock: (props: EventBlockProps) => React.JSX.Element;
export interface EmptyEventBlockProps {
    style: ViewStyle;
    styles: {
        [key: string]: ViewStyle | TextStyle;
    };
}
export declare const EmptyEventBlock: (props: EmptyEventBlockProps) => React.JSX.Element | null;
export default EventBlock;
