import { Text, View } from 'react-native'
import React from 'react'
import {
  LineChart,
} from "react-native-chart-kit";

const ChartView = ({ 
  width, 
  height, 
  data, 
  title, 
  onDataPointClick, 
  hidePointsAtIndex, 
  renderDotContent
}) => {

  return (
    <View style={{ backgroundColor: 'white'}}>
      <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight:'600', color: '#EF7777'}}>{title}</Text>
      <LineChart
        style={{padding: 10}} 
        data={data}
        width={width}
        height={height}
        chartConfig={{
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          fillShadowGradientFrom: '#FFBBBB',
          fillShadowGradientTo: '#BFFFF0',
          fillShadowGradientOpacity: 0.7,
          color: () => '#EF7777',
          labelColor: () => "black"
        }}
        bezier
        onDataPointClick={onDataPointClick}
        yAxisSuffix="%"
        hidePointsAtIndex={hidePointsAtIndex}
        fromZero
        renderDotContent={renderDotContent}
        segments={4}
      />
    </View>
  )
}

export default ChartView