import React, { Component } from 'react';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

var textColor = '#F9F9F9'
var borderColor = 'grey'
var arrowColor = 'white'

class Project extends Component {
  handleClick() {
    const zurl=`http://zooniverse.org/projects/${this.props.project.slug}`
    Linking.canOpenURL(zurl).then(supported => {
      if (supported) {
        Linking.openURL(zurl);
      } else {
        Alert.alert(
          'Error',
          'Sorry, but it looks like you are unable to open the project in your default browser.',
        )
      }
    });
  }

  render() {
    const imageURI = `https://${this.props.project.avatar_src}`
    return (
      <TouchableOpacity
        onPress={this.handleClick.bind(this)}>
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <Image source={{uri: imageURI}} style={styles.avatar} />
            <Text style={styles.title}>{this.props.project.display_name}</Text>
          </View>
          <Text style={styles.arrow}> > </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10
  },
  leftContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  title: {
    color: textColor,
    fontSize: 20,
  },
  avatar: {
    height: 40,
    marginRight: 10,
    width: 40,
  },
  arrow: {
    color: arrowColor
  }
});

Project.propTypes = { project: React.PropTypes.object.isRequired }
export default Project
