import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated, // provides methods for animating components
  Easing // for implementing easing functions
} from "react-native";
import { withAnchorPoint } from 'react-native-anchor-point';


// export default function Loader(): JSX.Element {


//   const cardOpacity = useRef(new Animated.Value(0)).current;
//   const cardPerspective = useRef(new Animated.Value(0)).current;
//   const cardRotate = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
//   const backgroundColor = useRef(new Animated.Value(0)).current;

//   const inputRange = [0, 0.2, 0.299, 0.3, 0.5499, 0.55 ,0.6, 1];
//   const rotateYOutputRange = ["-0deg","-0deg","-0deg", "-90deg","-90deg","-90deg", "-180deg","-180deg"];
//   const perspectiveOutputRange = [600, 600, 600, 200, 200, 200, 200, 200];
//   const bgColorOutputRange = ['#D8D8D8','#d8d8d8cb', '#d8d8d8cb', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8'];

//   // let cardOpacity = new Animated.Value(0); // declare an animated value
//   const cardScale = cardOpacity.interpolate({
//     inputRange: inputRange,
//     outputRange: [0, 0, 0, 0, 1, 0, 0 , 0],
//     extrapolate: 'clamp'
//   });

//   // let cardRotate = new Animated.ValueXY({x: 0, y: 0});
//   const rotateY = cardRotate.y.interpolate({inputRange: inputRange, outputRange: rotateYOutputRange, extrapolate: 'clamp'});

//   // let cardPerspective = new Animated.Value(0);
//   const perspective = cardPerspective.interpolate({inputRange: inputRange, outputRange: perspectiveOutputRange, extrapolate: 'clamp'});  

//   // let backgroundColor = new Animated.Value(0);
//   const background = cardPerspective.interpolate({inputRange: inputRange, outputRange: bgColorOutputRange, extrapolate: 'clamp'});  


//   useEffect(() => {

//     Animated.parallel([
//       Animated.timing(cardOpacity, {
//           toValue: 0.3,
//           duration: 1200,
//           useNativeDriver: false
//       }),
//       Animated.timing(cardRotate, {
//           toValue: 0.3,
//           duration: 1200,
//           useNativeDriver: false
//       }),
//       Animated.timing(cardPerspective, {
//           toValue: 0.3,
//           duration: 1200,
//           useNativeDriver: false
//       }),
//       Animated.timing(backgroundColor, {
//           toValue: 0.3,
//           duration: 1200,
//           useNativeDriver: false
//       })
//   ]).start();

//   }, [cardOpacity,cardPerspective,cardRotate, background]);

//   return( 
//     <View style={{ backgroundColor: 'blue'}}>      
//       <View style={{...styles.book, transform: [ { translateY: 50 }]}}>
//           <Animated.View style={{ ...styles.bookPage,
//             transform: [{rotateY: rotateY} ,{perspective: perspective}],
//             opacity: cardOpacity,
//             backgroundColor: background
//             }}
//           />
//       </View>
//     </View>
//   );
// }


// export const Loader2 = () => {
//     return(
//       <div style={{ backgroundColor: '#3498db'}}>
//         <div className="book">
//           <div className="book__page"></div>
//           <div className="book__page"></div>
//           <div className="book__page"></div>
//         </div>
//       </div>
//     );
// }
const FadeInView3 = (props) => {
  
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardPerspective = useRef(new Animated.Value(0)).current;
  const cardRotate = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const inputRange = [0, 0.2, 0.299, 0.3, 0.5499, 0.55 ,0.6, 1];
  const rotateYOutputRange = ["-0deg","-0deg","-0deg", "-90deg","-90deg","-90deg", "-180deg","-180deg"];
  const perspectiveOutputRange = [600, 600, 600, 200, 200, 200, 200, 200];
  // const bgColorOutputRange = ['#D8D8D8','#d8d8d8cb', '#d8d8d8cb', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8'];
  const bgColorOutputRange = ['red','blue', 'green', 'black', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8'];
  const cardScale = cardOpacity.interpolate({
    inputRange: inputRange,
    outputRange: [0, 0, 0, 0, 1, 0, 0 , 0],
    extrapolate: 'clamp'
  });
  const rotateY = cardRotate.y.interpolate({inputRange: inputRange, outputRange: rotateYOutputRange, extrapolate: 'clamp'});
  const perspective = cardPerspective.interpolate({inputRange: inputRange, outputRange: perspectiveOutputRange, extrapolate: 'clamp'});  
  const background = backgroundColor.interpolate({inputRange: inputRange, outputRange: bgColorOutputRange, extrapolate: 'clamp'});  


  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 1200,
          delay:2400,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(cardRotate, {
          toValue: 1,
          duration: 1200,
          delay: 2400,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(cardPerspective, {
          toValue: 1,
          duration: 1200,
          delay: 2400,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 1200,
          delay: 2400,
          easing: Easing.ease,
          useNativeDriver: false
      })
  ]).start();
  }, [cardRotate, cardOpacity, cardPerspective, backgroundColor]);

  const getTransform = () => {
    let transform = {
        transform: [{ perspective: 400 }, { rotateY: '180deg' }],
    };
    return withAnchorPoint(transform, { x: 0.5, y: 0 }, { width: 100, height: 100 });
};

  return (

      <Animated.View style={[styles.bookPage, getTransform()]}
                  // style={{
                  //   ...styles.bookPage, 
                  //   transform: [{rotateY: rotateY} ,{perspective: perspective}],
                  //   getTransform(),
                  //   opacity: cardOpacity,
                  //   backgroundColor: background
                  // }}
      >
        {props.children}
      </Animated.View>
  );
}

const FadeInView2 = (props) => {
  
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardPerspective = useRef(new Animated.Value(0)).current;
  const cardRotate = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const inputRange = [0, 0.2, 0.299, 0.3, 0.5499, 0.55 ,0.6, 1];
  const rotateYOutputRange = ["-0deg","-0deg","-0deg", "-90deg","-90deg","-90deg", "-180deg","-180deg"];
  const perspectiveOutputRange = [600, 600, 600, 200, 200, 200, 200, 200];
  // const bgColorOutputRange = ['#D8D8D8','#d8d8d8cb', '#d8d8d8cb', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8'];
  const bgColorOutputRange = ['red','blue', 'green', 'black', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8'];
  const cardScale = cardOpacity.interpolate({
    inputRange: inputRange,
    outputRange: [0, 0, 0, 0, 1, 0, 0 , 0],
    extrapolate: 'clamp'
  });
  const rotateY = cardRotate.y.interpolate({inputRange: inputRange, outputRange: rotateYOutputRange, extrapolate: 'clamp'});
  const perspective = cardPerspective.interpolate({inputRange: inputRange, outputRange: perspectiveOutputRange, extrapolate: 'clamp'});  
  const background = backgroundColor.interpolate({inputRange: inputRange, outputRange: bgColorOutputRange, extrapolate: 'clamp'});  


  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 1200,
          delay: 1200,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(cardRotate, {
          toValue: 1,
          duration: 1200,
          delay: 1200,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(cardPerspective, {
          toValue: 1,
          duration: 1200,
          delay: 1200,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 1200,
          delay: 1200,
          easing: Easing.ease,
          useNativeDriver: false
      })
  ]).start();
  }, [cardRotate, cardOpacity, cardPerspective, backgroundColor])

  return (

      <Animated.View style={{
                    ...styles.bookPage, 
                    transform: [{rotateY: rotateY} ,{perspective: perspective}],
                    opacity: cardOpacity,
                    backgroundColor: background
                    }}
      >
        {props.children}
      </Animated.View>
  );
}

const FadeInView = (props) => {
  
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardPerspective = useRef(new Animated.Value(0)).current;
  const cardRotate = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const inputRange = [0, 0.2, 0.299, 0.3, 0.5499, 0.55 ,0.6, 1];
  const rotateYOutputRange = ["-0deg","-0deg","-0deg", "-90deg","-90deg","-90deg", "-180deg","-180deg"];
  const perspectiveOutputRange = [600, 600, 600, 200, 200, 200, 200, -200];
  // const bgColorOutputRange = ['#D8D8D8','#d8d8d8cb', '#d8d8d8cb', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8'];
  const bgColorOutputRange = ['red','blue', 'green', 'black', '#D8D8D8', '#D8D8D8', '#D8D8D8', '#D8D8D8'];
  const cardScale = cardOpacity.interpolate({
    inputRange: inputRange,
    outputRange: [0, 0, 0, 0, 1, 0, 0 , 0],
    extrapolate: 'clamp'
  });
  const rotateY = cardRotate.y.interpolate({inputRange: inputRange, outputRange: rotateYOutputRange, extrapolate: 'clamp'});
  const perspective = cardPerspective.interpolate({inputRange: inputRange, outputRange: perspectiveOutputRange, extrapolate: 'clamp'});  
  const background = backgroundColor.interpolate({inputRange: inputRange, outputRange: bgColorOutputRange, extrapolate: 'clamp'});  


  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 1200,
          delay: 4200,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(cardRotate, {
          toValue: 1,
          duration: 1200,
          delay: 4200,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(cardPerspective, {
          toValue: 1,
          duration: 1200,
          delay: 4200,
          easing: Easing.ease,
          useNativeDriver: false
      }),
      Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 1200,
          delay: 4200,
          easing: Easing.ease,
          useNativeDriver: false
      })
  ]).start();
  }, [cardRotate, cardOpacity, cardPerspective, backgroundColor])

  return (

      <Animated.View style={{
                    ...styles.bookPage, 
                    transform: [{rotateY: rotateY} ,{perspective: perspective}],
                    opacity: cardOpacity,
                    backgroundColor: background
                    }}
      >
        {props.children}
      </Animated.View>
  );
}

// You can then use your `FadeInView` in place of a `View` in your components:
export default () => {
  return (
    <View style={{...styles.book, transform: [ { translateY: 50 }] }}>
      <FadeInView style={{ zIndex: -1 }}>
        <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
      </FadeInView>
      <FadeInView2 style={{ zIndex: -2 }}>
        <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>kkk in</Text>
      </FadeInView2>
      <FadeInView3 style={{ zIndex: -3 }}>
        <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>ppp in</Text>
      </FadeInView3>
    </View>
  )
}

function transformOrigin(matrix, origin) {
  const { x, y, z } = origin;

  const translate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  MatrixMath.multiplyInto(matrix, translate, matrix);

  const untranslate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
  MatrixMath.multiplyInto(matrix, matrix, untranslate);
}

const styles = StyleSheet.create({
  book: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    margin:'auto',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 2,
    width:100,
    height:60,
    color: 'pink'
  },
  bookPage: {
    position: 'absolute',
    left:'50%',
    top:-5,
    margin:'0 auto',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth:2,
    borderStyle:'solid',
    // borderBottomStyle:'solid',
    // borderRightStyle:'solid',
    borderTopColor:'black',
    borderBottomColor:'black',
    borderRightColor:'black',
    color: '#D8D8D8',
    width:50,
    height:60
  }
});