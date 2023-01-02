var bar_human = new ProgressBar.Line('#bar_human', {
  strokeWidth: 6,
  easing: 'easeInOut',
  duration: 1000,
  color: '#EB4D4D',
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: {display: 'block', width: '100%', position: 'absolute'},
  text: {
    style: {
      // Text color.
      // Default: same as stroke color (options.color)
      color: '#EB4D4D',
      position: 'absolute',
      left:'45%',
      top: '200%',
      padding: 0,
      margin: 0,
      transform: null
    },
    autoStyleContainer: false
  },
  from: {color: '#FFEA82'},
  to: {color: '#ED6A5A'},
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 100) + ' %');
  }
});


var bar_machine = new ProgressBar.Line('#bar_machine', {
  strokeWidth: 6,
  easing: 'easeInOut',
  duration: 1000,
  color: '#4baddb',
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: {display: 'block', width: '100%', position: 'absolute'},
  text: {
    style: {
      // Text color.
      // Default: same as stroke color (options.color)
      color: '#4baddb',
      position: 'absolute',
      left:'45%',
      top: '200%',
      padding: 0,
      margin: 0,
      transform: null
    },
    autoStyleContainer: false
  },
  from: {color: '#FFEA82'},
  to: {color: '#ED6A5A'},
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 100) + ' %');
  }
});

// bar.set(0.4);
// bar.animate(0.9);  // Number from 0.0 to 1.0
// bar.animate(1.0);