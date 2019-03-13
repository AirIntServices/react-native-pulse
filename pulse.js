import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, Image, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center"
  },
  pulse: {
    position: "absolute",
    flex: 1
  }
});

export default class Pulse extends Component {
  static propTypes = {
    color: PropTypes.string,
    diameter: PropTypes.number,
    duration: PropTypes.number,
    image: PropTypes.object,
    initialDiameter: PropTypes.number,
    numPulses: PropTypes.number,
    pulseStyle: PropTypes.object,
    speed: PropTypes.number,
    style: PropTypes.object
  };

  static defaultProps = {
    color: "blue",
    diameter: 400,
    duration: 1000,
    image: null,
    initialDiameter: 0,
    numPulses: 3,
    pulseStyle: {},
    speed: 10,
    style: {
      top: 0,
      bottom: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      color: this.props.color,
      duration: this.props.duration,
      image: this.props.image,
      maxDiameter: this.props.diameter,
      numPulses: this.props.numPulses,
      pulses: [],
      pulseStyle: this.props.pulseStyle,
      speed: this.props.speed,
      started: false,
      style: this.props.style
    };
  }

  mounted = true;

  componentDidMount() {
    const { numPulses, duration } = this.props;
    const speed = 10;
    this.setState({ started: true });

    let a = 0;
    while (a < numPulses) {
      this.createPulseTimer = setTimeout(() => {
        this.createPulse(a);
      }, a * duration);

      a++;
    }

    this.timer = setInterval(() => {
      this.updatePulse();
    }, speed);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.createPulseTimer);
    clearInterval(this.timer);
  }

  createPulse = pKey => {
    if (this.mounted) {
      let pulses = this.state.pulses;

      let pulse = {
        pulseKey: pulses.length + 1,
        diameter: this.props.initialDiameter,
        opacity: 0.5,
        centerOffset: (this.props.diameter - this.props.initialDiameter) / 2
      };

      pulses.push(pulse);

      this.setState({ pulses });
    }
  };

  updatePulse = () => {
    if (this.mounted) {
      const pulses = this.state.pulses.map((p, i) => {
        let maxDiameter = this.props.diameter;
        let newDiameter = p.diameter > maxDiameter ? 0 : p.diameter + 2;
        let centerOffset = (maxDiameter - newDiameter) / 2;
        let opacity = Math.abs(newDiameter / this.props.diameter - 1);

        let pulse = {
          pulseKey: i + 1,
          diameter: newDiameter,
          opacity: opacity > 0.5 ? 0.5 : opacity,
          centerOffset: centerOffset
        };

        return pulse;
      });

      this.setState({ pulses });
    }
  };

  getColor() {
    const perc = this.props.color;

    let r,
      g,
      b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc) - Math.max(this.props.numPulses * 20, 0);
    } else {
      g = 255;
      r =
        Math.round(510 - 5.1 * perc) -
        Math.max(50 - this.props.numPulses * 5, 0);
    }
    var h = r * 0x10000 + g * 0x100 + b;
    return "#" + ("000000" + h.toString(16)).slice(-6);
  }

  render() {
    const { image, pulses, pulseStyle, started, style } = this.state;
    const containerStyle = [styles.container, style];
    const maxDiameter = this.props.diameter;
    const pulseWrapperStyle = { width: maxDiameter, height: maxDiameter };
    const color = this.props.color;
    return (
      <View style={containerStyle}>
        {started && (
          <View style={pulseWrapperStyle}>
            {pulses.map(pulse => (
              <View
                key={pulse.pulseKey}
                style={[
                  styles.pulse,
                  {
                    backgroundColor: color,
                    width: pulse.diameter,
                    height: pulse.diameter,
                    opacity: pulse.opacity,
                    borderRadius: pulse.diameter / 2,
                    top: pulse.centerOffset,
                    left: pulse.centerOffset
                  },
                  pulseStyle
                ]}
              />
            ))}
            {image && <Image style={image.style} source={image.source} />}
          </View>
        )}
      </View>
    );
  }
}
