import { View, ViewProps } from 'react-native';

interface RowProps extends ViewProps {
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  items?: 'start' | 'center' | 'end' | 'stretch';
}

export function Row({
  className = '',
  justify = 'start',
  items = 'center',
  children,
  ...props
}: RowProps) {

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const itemsMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClass = justify ? justifyMap[justify] : '';
  const itemsClass = items ? itemsMap[items] : '';

  return (
    <View className={`flex-row ${justifyClass} ${itemsClass} ${className}`} {...props}>
      {children}
    </View>
  );
}
