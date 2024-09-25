/*! For license information please see main.cfc9a4f4.js.LICENSE.txt */
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,QH=Ki`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,_H=Ki`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,FH=XG("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),NH=XG(CH,{name:"MuiTouchRipple",slot:"Ripple"})`
  opacity: 0;
  position: absolute;

  &.${kH.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${SH};
    animation-duration: ${550}ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
  }

  &.${kH.ripplePulsate} {
    animation-duration: ${e=>{let{theme:t}=e;return t.transitions.duration.shorter}}ms;
  }

  & .${kH.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${kH.childLeaving} {
    opacity: 0;
    animation-name: ${QH};
    animation-duration: ${550}ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
  }

  & .${kH.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${_H};
    animation-duration: 2500ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
//# sourceMappingURL=main.cfc9a4f4.js.map