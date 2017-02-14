import React from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import StyledText from './StyledText'
import { addIndex, filter, map, propEq } from 'ramda'
import { connect } from 'react-redux'
import {GLOBALS} from '../constants/globals'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import Discipline from './Discipline'
import OverlaySpinner from './OverlaySpinner'
import { setState } from '../actions/index'

GoogleAnalytics.setTrackerId(GLOBALS.GOOGLE_ANALYTICS_TRACKING)
GoogleAnalytics.trackEvent('view', 'Home')

const topPadding = (Platform.OS === 'ios') ? 10 : 0

const mapStateToProps = (state) => ({
  user: state.user,
  isGuestUser: state.user.isGuestUser,
  isConnected: state.isConnected,
  isFetching: state.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  setSelectedProjectTag(tag) {
    dispatch(setState('selectedProjectTag', tag))
  },
})

export class ProjectDisciplines extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const renderDiscipline = ({value, label, color}, idx) => {
      return (
        <Discipline
          icon={value}
          title={label}
          tag={value}
          key={idx}
          color={color}
          setSelectedProjectTag={() => {this.props.setSelectedProjectTag(value)}} /> )
    }

    const DisciplineList =
      <ScrollView>
        {addIndex(map)(
          (discipline, idx) => { return renderDiscipline(discipline, idx) },
          filter(propEq('display', true), GLOBALS.DISCIPLINES)
        )}
      </ScrollView>

    const noConnection =
      <View style={styles.messageContainer}>
        <StyledText textStyle={'errorMessage'}
          text={'You must have an internet connection to use Zooniverse Mobile'} />
      </View>

    const totalClassifications =
      <StyledText
        additionalStyles={[styles.totalClassifications]}
        text={`${this.props.user.totalClassifications} total classifications`} />

    return (
      <View style={styles.container}>
        <View style={styles.subNavContainer}>
            <StyledText additionalStyles={[styles.userName]}
              text = { this.props.isGuestUser ? 'Guest User' : this.props.user.display_name } />
            { this.props.user.totalClassifications > 0
              ? totalClassifications
              : null }
        </View>
        <View style={styles.innerContainer}>
          { this.props.isConnected ? DisciplineList : noConnection }
        </View>
        { this.props.isFetching ? <OverlaySpinner /> : null }
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  subNavContainer: {
    borderBottomColor: '$lightGrey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 136 + topPadding,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 184 + topPadding
  },
  userName: {
    color: '$darkTextColor',
    fontWeight: 'bold'
  },
  totalClassifications: {
    color: '$darkTextColor',
  },
  signOut: {
    backgroundColor: '$transparent',
  },
  signOutText: {
    color: '$darkTextColor',
    fontSize: 11,
  },
  messageContainer: {
    padding: 15,
  },
  innerContainer: {
    flex: 1,
    marginTop: 10,
  }
});

ProjectDisciplines.propTypes = {
  user: React.PropTypes.object,
  isGuestUser: React.PropTypes.bool,
  isConnected: React.PropTypes.bool,
  isFetching: React.PropTypes.bool,
  setSelectedProjectTag: React.PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDisciplines)
