// Weight.js
// 체중 표기를 위한 컴포넌트

import React from 'react';
import { TouchableOpacity,Text, View } from 'react-native';
import { readSizeByPartsLatestWeight } from '../../backend/Read';
import { FontAwesome5 } from '@expo/vector-icons'; 
import styles from '../../styles/main/WeightAndFat.Style.js';
import { common } from '../../styles/Common.Style.js';

const Weight = ({onPress, weight}) => {
    return(
        <TouchableOpacity style={styles.box} onPress={onPress}>
            <View style={common.textBoxCenter}>
                <FontAwesome5 style={styles.icon} name={'weight'} size={16}/>
                <Text style={styles.title}>체중</Text>
            </View>
            <View style={[common.textBoxEnd, styles.weightBox]}>
                <Text style={styles.weight}>{weight == null ? 0.0 : weight}</Text>
                <Text style={styles.unit}> kg</Text>
            </View>
        </TouchableOpacity>
    );
}

export default Weight;