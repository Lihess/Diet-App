// measurandRecord.js
// 측정량 기입을 위한 입력 modal. 아래에 측정 팁도 함께 표기
// 합칠 수 있으면 합치기.
// 색상은 후에 생각해보기

import React from 'react';
import Modal from 'react-native-modal';
// https://github.com/react-native-community/react-native-modal
import { NavigationService } from '../../router/service';
import { TouchableOpacity, View, TextInput, Text, Image } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { common, modal } from '../../styles/Common.Style.js';
import styles from '../../styles/modal/MeasurandRecord.Style.js';
import CalendarModal from './CalenderModal.js';
import { createSizeByPart } from '../../backend/Create';
import { FatConsumer } from '../FatContext';
import { cmToInch, inchToCm} from '../ChangeUnit'
import getToday from '../GetToday'

export default class MeasurandRecord extends React.Component {
    tipImage = {
        어깨 : require('../../assets/tip/어깨.png'),
        윗가슴 : require('../../assets/tip/윗가슴.png'),
        팔뚝 : require('../../assets/tip/팔뚝.png'),
        허리 : require('../../assets/tip/허리.png'),
        엉덩이 : require('../../assets/tip/엉덩이.png'),
        허벅지 : require('../../assets/tip/허벅지.png'),
        종아리 : require('../../assets/tip/종아리.png')
    }

    tipContent = {
        어깨 : '어깨뼈 바깥 부분 사이의 거리를\n측정하세요!',
        윗가슴 : '유두를 지나는 선에 따라\n 측정하세요!',
        팔뚝 : '팔꿈치 위, 가장 두꺼운 부분의 둘레를\n측정하세요!',
        허리 : '팔을 내렸을 때 팔꿈치와 동일한 위치나\n배꼽 바로 위의 둘레를 측정하세요!',
        엉덩이 : '엉덩이에서 가장 두꺼운 부분의\n둘레를 측정하세요!',
        허벅지 : '차렷 자세에서 손가락 끝이 닿는 위치를\n측정하세요!',
        종아리 : '차렷 자세에서 종아리의 가장 두꺼운\n부분의 둘레를 측정하세요!',
        체중 : '기상 후 공복인 상태에서\n측정하는 것이 가장 좋습니다.\n\n이를 지키기 어렵다면\n되도록 동일한 시간대에 측정하세요!'
    }

    state = {
        visible : false,
        calenderVisible : false,
        date : getToday(),
        unit : 'cm',
        decimalInformation : false, // 소수점 관련 안내문구의 표기 여부
        rangeInformation : false, // 입력범위 관련 안내문구의 표기 여부
        size : '',
        foucsColor : '#c4c4c4'
    } 
    
    // props 값이 변경된 경우 state 값 변경
    // componentWillRecivedProps 에서 getDerivedStateFromProps로 변경됨.
    // 안에는 this 사용 불가. 변경할 state가 있다면 객체 형태로 반환
    static getDerivedStateFromProps = (nextProps, prevState) => {
        const state = {};
   
        if(nextProps.visible != prevState.visible)
            state.visible = nextProps.visible;
        if (nextProps.date && nextProps.date != prevState.date) 
            state.date = nextProps.date;
        
        return state;
    }

    // Modal이 열려있을때만 실행되는 함수
    closedModal = () => {
        if (this.state.visible) { 
            this.props.onBackdropPress()
            this.setState({
                visible : false,
                calenderVisible : false,
                date : getToday(),
                unit : 'cm',
                decimalInformation : false,
                rangeInformation : false,
                size : '',
                foucsColor : '#c4c4c4'
            })
        }
    }

    // Chart 페이지로 이동
    onPressIcon = () => {
        this.closedModal()
        NavigationService.navigate('ChartPage', {part : this.props.part})
    }

    // 날짜 재지정을 위한 캘린더 modal open / close
    toggleCalenderVisible = () => {
        this.setState({ calenderVisible : !this.state.calenderVisible })
    }

    // 단위 선택 시, 해당 단위로 state 값 변경
    onSelectUnit = (value) => {
        if (value == 0 && this.state.unit == 'inch' && this.state.size )
            this.setState({ size : inchToCm(this.state.size) })
        else if (value == 1 && this.state.unit == 'cm' && this.state.size )
            this.setState({ size : cmToInch(this.state.size)})

        value == 0 ? this.setState({unit : 'cm'}) : this.setState({unit : 'inch'});
    }

    // 입력된 값의 범위는 2.0 ~ 300.0 만 허용하기 위한 함수
    checkRange = (text) => {
        if (text === '0' || (text < 2 && text.length > 1)) {
            this.setState({ rangeInformation : true })
            return '2.0';
        }
        else if (text > 300) {
            this.setState({ rangeInformation : true })
            return '300.0';
        }
        else {
            this.setState({ rangeInformation : false })    
            return text;
        } 
    }

    // text가 입력될때 정해진 정규 표현식의 입력만 받기 위한 함수
    onChangeText = (text) => {
        // 소수점 둘째자리까지의 숫자만 입력가능.
        if (/^(\d+)\.{0,1}\d{0,2}$/.test(text) || text === ''){
            text = this.checkRange(text);

            this.setState({
                size : text,
                decimalInformation : false,
            });
        }
        // 소수점 둘째자리 초과 입력하면 안내문구나 출력되도록
        else if (/^(\d+)\.\d\d\d$/.test(text)){
            this.setState({ decimalInformation : true });
        }
    }

    // 입력 시 색상 변경 이벤트
    onFocusInput = () => {
        this.setState({
            foucsColor : '#FF824A'
        })
    }

    // 입력 시 색상 변경 이벤트
    onBlurInput = () => {
        this.setState({
            foucsColor : '#c4c4c4'
        })
    }

    onSubmit = (setFatPercentW) => {
        // 기본 저장 형식은 cm
        const size = this.state.unit == 'inch' ? inchToCm(this.state.size) : this.state.size;

        // 입력된 정보를 DB에 저장
        // 값을 입력한 경우에만 저장
        if(this.state.size) {
            // 허리 치수일 경우, 체지방률을 다시 설정함
            if (this.props.part == '허리')
                setFatPercentW(size)
            
            createSizeByPart(this.state.date, this.props.part, size)    
        }
    
        this.props.onSubmit();
        this.closedModal();
    }
    
    // 선택 날짜로 재지정
    selectDay = (selectDate) => {
        if (!selectDate) {
            this.setState({ date : getToday() })
        }
        else
            this.setState({ date : selectDate })
    }

    render(){
        return(
            <Modal 
            style={modal.background}
            isVisible={this.state.visible}
            onBackdropPress={this.closedModal} 
            onBackButtonPress={this.closedModal}
            backdropColor={'#1f1f1f'}>
           
                <View style={modal.box}>
                    <View style={styles.titleBox}>
                        <View style={common.textBoxCenter}>
                            <Text style={modal.title}> {this.props.part} </Text>
                            <MaterialCommunityIcons name="chart-bar" size={27} color={'#FF824A'} onPress={this.onPressIcon}/>
                        </View>
                        {/* 날짜를 클릭하면 캘린더가 나와서 원하는 날짜를 지정할 수 있도록. */}
                        <Text style={styles.date} onPress={this.props.date ? null : this.toggleCalenderVisible}>
                            {this.state.date.replace(/\-/g, '.')}
                        </Text>
                    </View>
                    
                    <View style={[styles.inputBox, {borderColor : this.state.foucsColor}]}>
                        { this.props.part != '체중' ?
                            <SwitchSelector 
                                style={{borderColor : this.state.foucsColor}}
                                options={[
                                    {label : 'cm', value : '0'},
                                    {label : 'inch', value : '1'}
                                ]} 
                                initial={0} 
                                backgroundColor={'#e4e4e4'}
                                buttonColor={'white'}
                                borderRadius={0}
                                height={30}
                                alignItems={'center'}
                                textStyle={styles.switchFont}
                                selectedTextStyle={styles.switchSelect}
                                animationDuration={50}
                                onPress={value => this.onSelectUnit(value)} /> : null
                        }
                        <TextInput 
                            style={styles.input} 
                            keyboardType={'numeric'}
                            placeholder={this.props.size ? (this.state.unit == 'cm' ? `${this.props.size}` : `${cmToInch(this.props.size)}`) : '0.0'}
                            value={String(this.state.size)}
                            onChangeText={(text) => this.onChangeText(text)}
                            onFocus={this.onFocusInput}
                            onBlur={this.onBlurInput}/>
                    </View> 
                    
                    { this.state.decimalInformation ?
                            <Text style={modal.information}> 소수점 이하 2자리까지만 입력하세요. </Text> : null
                    }{ this.state.rangeInformation ?
                            <Text style={modal.information}> 2.0 ~ 300.0 사이 값만 입력하세요. </Text> : null }

                    <View style={styles.tipBox}>
                        { this.props.part != '체중' ?
                            <Image style={styles.tipImage} source={this.tipImage[this.props.part]}/> : null}
                        <Text style={styles.tipContent}>{this.tipContent[this.props.part]}</Text>
                    </View>
                    <FatConsumer>
                        { ({setFatPercentW}) => 
                            <TouchableOpacity style={modal.submit} onPress={() => {
                                this.onSubmit(setFatPercentW)}}> 
                                <Text style={modal.submitText}>완료</Text>    
                            </TouchableOpacity> }
                    </FatConsumer>           
                </View>

                { /* 날짜 선택시 해당 modal이 보이도록! */ }
                <CalendarModal
                    selectDate={this.state.date} 
                    visible={this.state.calenderVisible} 
                    onBackdropPress={this.toggleCalenderVisible} 
                    onSubmit={(date) => this.selectDay(date)}/> 
            </Modal>
        );
    }
}